"use client";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from 'react'
import ExpenseSummary from "./components/Expense-summary";
import { Button } from "@/components/ui/button";
import { Chevron } from "react-day-picker";
import { ChevronRight } from "lucide-react";
import { BarLoader } from "react-spinners";

const DashboardPage = () => {
  const { data: balances, isLoading: balancesLoading } = useConvexQuery(
    api.dashboard.getUserBalances
  );

  const { data: groups, isLoading: groupsLoading } = useConvexQuery(
    api.dashboard.getUserGroups
  );

  const { data: totalSpent, isLoading: totalSpentLoading } = useConvexQuery(
    api.dashboard.getTotalSpent
  );

  const { data: monthlySpending, isLoading: monthlySpendingLoading } = useConvexQuery(
    api.dashboard.getMonthlySpending
  );

  const isLoading = 
    balancesLoading ||
    groupsLoading ||
    totalSpentLoading ||
    monthlySpendingLoading;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {isLoading ? (
        <div className="w-full py-12 flex justify-center">
          <BarLoader width={"100%"} color="#36d7b7" /> 
        </div>
      ) : (
        <>
          <div className="w-full py-12 flex justify-between">
            <h1 className="text-5xl gradient-title">Dashboard</h1>

            <Button asChild>
                <Link href="/expenses/new">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Expense
                </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {balances.totalBalance > 0 ? (
                    <span className="text-green-600">
                      +${balances?.totalBalance.toFixed(2)}
                    </span>
                  ) : balances?.totalBalance < 0 ? (
                    <span className="text-red-600">
                      -${Math.abs(balances?.totalBalance).toFixed(2)}
                    </span>
                  ) : (
                    <span>$0.00</span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {balances?.totalBalance > 0
                    ? "You are owed money"
                    : balances?.totalBalance < 0
                    ? "You owe money"
                    : "All settled up!"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  You are owed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${balances?.youAreOwed.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  you owe
                </CardTitle>
              </CardHeader>
              <CardContent>
                {balances?.oweDetails?.youOwe?.length > 0? (
                  <>
                    <div className="text-2xl font-bold text-red-600">
                      ${balances?.youOwe.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      To {balances?.oweDetails?.youOwe?.length || 0} people
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You don't owe anyone
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/*left column */}
            <div className="lg:col-span-2 space-y-6">
              {/*Expense summary */}
              <ExpenseSummary 
                  monthlySpending = {monthlySpending}
                  totalSpent = {totalSpent}
              />
            </div>

            {/*right column */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Balance Details</CardTitle>
              </CardHeader>
              <Button variant="link" asChild className="p-0">
                <Link href="/contacts">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4"/> 
                </Link>
              </Button>
              <CardContent></CardContent>
            </Card>

            {/*Groups */}
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage;
