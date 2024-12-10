"use client";

// import { createOpening } from "@/actions/opening";
import {
    // createOrganization,
    createZinterviewOrganization,
    updateZinterviewOrganization,
} from "@/actions/organizations";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import useOrgStore from "@/hooks/useOrganization";
import { useState } from "react";
import { useForm } from "react-hook-form";

const IntegrateWithZinterview = ({
    organizationId,
    // openingId,
}: {
    organizationId: string;
    openingId: string;
}) => {
    const { register, handleSubmit } = useForm<{ name: string; email: string } | { ApiKey: string }>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const [alreadyHaveOne, setAlreadyHaveOne] = useState(true);
    const { setOrgId } = useOrgStore((state) => state);

    const { mutate: createZinterviewOrganizationMutation, isPending: isCreatePending } = useMutationData(
        ["CreateZinterviewOrganization"],
        (data) => createZinterviewOrganization(data),
        "get-organizations",
        (data) => {
            // console.log(data);
            if (data.status === 200) {
                setOrgId(data.data);
                toast({
                    title: "Success",
                    description: "Organization created successfully",
                });
                setIsDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                });
            }
        }
    );

    const { mutate: updateZinterviewOrganizationMutation, isPending: isUpdatePending } = useMutationData(
        ["UpdateZinterviewOrganization"],
        (data) => updateZinterviewOrganization(data),
        "get-organizations",
        (data) => {
            // console.log("update", data);
            if (data.status === 200) {
                setOrgId(data.data);
                toast({
                    title: "Success",
                    description: "Integrated with Zinterview successfully",
                });
                setIsDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                });
            }
        }
    );

    const onSubmit = (data: { name: string; email?: string } | { ApiKey: string }) => {
        if (!alreadyHaveOne) {
            if ("name" in data) {
                createZinterviewOrganizationMutation({
                    name: data.name,
                    email: data.email,
                    orgId: organizationId,
                });
            }
        } else {
            updateZinterviewOrganizationMutation({
                ApiKey: "ApiKey" in data ? data.ApiKey : "",
                orgId: organizationId,
            });
        }
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    // variant="default"
                    className="w-full bg-violet-500"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Integrate with Zinterview
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Integrate With Zinterview</DialogTitle>
                    <DialogDescription>
                        Zinterview Details.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        {!alreadyHaveOne ? (
                            <>
                                <div className="flex w-full justify-between gap-2 items-center">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter Organization Name"
                                        {...register("name")}
                                    />
                                </div>
                                <div className="flex w-full justify-between gap-2 items-center">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="Admin Email"
                                        {...register("email")}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex w-full justify-between gap-2 items-center">
                                <Label htmlFor="ApiKey">API_KEY</Label>
                                <Input
                                    id="ApiKey"
                                    placeholder="Enter your Zinterview API Key"
                                    {...register("ApiKey")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex w-full justify-between">
                        <Button
                            variant="outline"
                            style={{
                                borderColor: "rgba(107, 114, 128, 1)",
                            }}
                            onClick={() => setAlreadyHaveOne(!alreadyHaveOne)}
                        >
                            {alreadyHaveOne ? "Don't have one?" : "Already have one?"}
                        </Button>
                        <div></div>
                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                        >
                            {alreadyHaveOne
                                ? isUpdatePending
                                    ? "Updating..."
                                    : "Update"
                                : isCreatePending
                                ? "Creating..."
                                : "Create"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default IntegrateWithZinterview;
