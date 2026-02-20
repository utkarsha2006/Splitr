import { convexToJson, v } from "convex/values";
import { query } from "./_generated/server";

export const getGroupExpenses = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

        const group = await ctx.db.query("groups").get(groupId);
        if(!group) throw new Error("Group not found");

        if (!group.members.some((m) => m.userId === currentUser._id))
            throw new Error("You are not a member of this group");

        const expenses = await ctx.db
            .query("settlements")
            .filter((q) => q.eq(q.field("groupId"), groupId))
            .collect();

        /* ---------------- member map -------------- */
        const memberDetails = await Promise.all(
            group.members.map(async (m) => {
                return{
                    id: u._id,
                    name: u.name,
                    imageUrl: u.imageUrl,
                    role: m.role,
                };
            })
        );

        const ids = memberDetails.map((m) => m.id);

        // Balance Calculation Setup
        // -----------------------------------
        // Initialize totals object to track overall balance for each user
        // Format: ( userId1: balance1, userId2: balance2, ...)
        const totals = Object.fromEntries(ids.map((id) => [id, 0]));

        //Create a two-dimensional ledger to track who owes whom
        // ledger [A][B] = how much A owes B
        const ledger = {};

        ids.forEach((a) => {
            ledger[a] = {};
            ids.forEach(b => {
                if ( a != b) ledger[a][b] = 0;
            });
        });

        //Apply Expenses to Balances
        // --------------------------
        // Example: 
        // - Expense 1 : user1 paid $60, split equally among all 3 users ($20 each)
        // - After applying this expense:
        // - totals : { user1: +40, user2: -20, user3: -20 }
        //- ledger : { user1: { user2: +20, user3: +20 }, user2: { user1: -20 }, user3: { user1: -20 } }
        // - This means user2 owes user1 $20, and user3 owes user1 $20

        for(const exp of expenses) {
            const payer = exp.paidByUserId;

            for (const split of exp.splits) {
                // Skip if this is the payers own split or if already paid
                if(split.userId === payer || split.paid) continue;

                const debtor = split.userId;
                const amt = split.amount;

                //Update totals : increase payers balance, decrease debtors balance
                totals[payer] += amt; //Payer gains credit
                totals[debtor] -= amt; //Debtor gains debt

                ledger[debtor][payer] += amt; //Debtor owes payer
            }
        }

        //Apply Settlements to balances
        /* Example:
        - Settlement 1: user2 pays user1 $20
        - After applying this settlement:
        - totals : { user1: +20, user2: -20, user3: -20 }
        - ledger : { user1: { user2: +0, user3: +20 }, user2: { user1: +0 }, user3: { user1: -20 } }
        - This means user2 has settled their debt to user1, but user3 still owes user1 $20
        */
        for(const s of settlements) {
            //Update totals
            total[s.paidByUserId] += s.amount;
            total[s.paidToUserId] -= s.amount;

            //Update ledger: reduce what the payer owes to the receiver
            ledger[s.paidByUserId][s.paidToUserId] -= s.amount;
        }

        //Format Response Data
        // -------------------------
        // Create a comprehensive balance object for each member 
        const balances = memberDetails.map((m) => ({
            ...m,
            totalBalance : totals[m.id],
            owes: Object.entries(ledger[m.id])
            .filter(([, v]) => v > 0)
            .map(([to, amount]) => ({to, amount})),
            owedBy: ids
            .filter((other) => ledger[other][m.id] > 0)
            .map((other) => ({ from: other, amount: ledger[other][m.id] })),
        }));

        const userLookupMap = {};
        memberDetails.forEach((member) => {
            userLookupMap[member.id] = member;
        });

        return {
            // Group Information    
            group: {
                id: group._id,
                name: group.name,
                description: group.description,
            },
            members: memberDetails,
            expenses,
            settlements,
            balances,
            userLookupMap,
        };
    },
});