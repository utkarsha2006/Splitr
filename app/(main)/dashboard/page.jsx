"use client";
import { CardContent, CardDescription, CardHeader, Card, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from 'react'
import ExpenseSummary from "./components/Expense-summary";
import { Button } from "@/components/ui/button";
import { Chevron } from "react-day-picker";
import { ChevronRight, PlusCircle, Users } from "lucide-react";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            {/*left column - Expense Summary */}
            <div className="lg:col-span-2">
              <ExpenseSummary 
                  monthlySpending = {monthlySpending}
                  totalSpent = {totalSpent}
              />
            </div>

            {/*right column - Balance Details and Groups */}
            <div className="space-y-6">
              {/* Balance Details */}
              <Card>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle>Balance Details</CardTitle>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/contacts" className="text-sm">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4"/> 
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {balances?.oweDetails?.youAreOwed?.length > 0 ? (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-sm font-semibold">Owed to You</p>
                        </div>
                        <div className="space-y-3">
                          {balances.oweDetails.youAreOwed.slice(0, 3).map((person) => (
                            <div key={person.userId} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {person.name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-sm">{person.name}</p>
                              </div>
                              <p className="text-sm font-semibold text-green-600">
                                +${person.amount.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No outstanding balances</p>
                  )}
                </CardContent>
              </Card>

              {/* Your Groups */}
              <Card>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle>Your Groups</CardTitle>
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/contacts" className="text-sm">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4"/> 
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {groups && groups.length > 0 ? (
                    <div className="space-y-3">
                      {groups.map((group) => (
                        <Link
                          key={group.id}
                          href={`/groups/${group.id}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{group.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {group.members?.length || 0} members
                              </p>
                            </div>
                          </div>
                          <p className={`text-sm font-semibold ${
                            group.balance > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {group.balance > 0 ? "+" : ""} ${Math.abs(group.balance).toFixed(2)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No groups yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage;
