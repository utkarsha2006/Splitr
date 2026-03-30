"use client"

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from 'react';
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { TabsContent, TabsTrigger, Tabs, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExpenseList } from "@/components/expense-list";
import { SettlementList } from "@/components/settlement-list";

const PersonPage = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("expenses");

    const { data, isLoading } = useConvexQuery(
        api.expenses.getExpensesBetweenUsers,
        { userId: params.id }
    );
    
    if (isLoading) {
        return (
            <div className="container mx-auto py-12">
                <BarLoader width={"100%"} color="#36d7b7"></BarLoader>
            </div>
        )
    }

    const otherUser = data?.otherUser;
    const expenses = data?.expenses || [];
    const settlements = data?.settlements || [];
    const balance = data?.balance || 0;

    return (
        <div>
            <div className="mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    className="mb-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back
                </Button>

                <div className="flex item-center justify-between">
                    <div className="flex item-center gap-3">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={otherUser?.imageUrl} />
                            <AvatarFallback>
                                {otherUser?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-4xl gradient-title">{otherUser?.name}</h1>
                            <p className="text-muted-foreground">{otherUser?.email}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/dashboard/expenses/new`}>
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add expense
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
            </Card>

            <Tabs
                defaultValue="expenses"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expenses">
                        Expenses ({expenses.length})
                    </TabsTrigger>
                    <TabsTrigger value="settlements">
                        Settlements ({settlements.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="expenses" className="space-y-4">
                    <ExpenseList 
                        expenses={expenses}
                        showOtherPerson={false}
                        otherPersonId={params.id}
                        userLookupMap={{ [otherUser.id]: otherUser }}
                    />
                </TabsContent>
                <TabsContent value="settlements" className="space-y-4">
                    <SettlementList 
                        settlements={settlements}
                        userLookupMap={{ [otherUser.id]: otherUser }}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default PersonPage; 