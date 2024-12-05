"use client";

import { createOpening } from "@/actions/opening";
import {
    createOrganization,
    createZinterviewOrganization,
    updateZinterviewOrganization,
    updateZinterviewSettings,
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
import { toast } from "sonner";

const ZinterviewSettings = ({ organizationId, openingId }: { organizationId: string; openingId: string }) => {
    const { register, handleSubmit } = useForm<{ apiKey: string }>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    // const [alreadyHaveOne, setAlreadyHaveOne] = useState(true);
    const { setOrgId } = useOrgStore((state) => state);

    // const { mutate: createZinterviewOrganizationMutation, isPending: isCreatePending } = useMutationData(
    //     ["CreateZinterviewOrganization"],
    //     (data) => createZinterviewOrganization(data),
    //     "get-organizations",
    //     (data) => {
    //         setOrgId(data.data);
    //         toast({
    //             title: "Success",
    //             description: "Opening created successfully",
    //         });
    //         setIsDialogOpen(false);
    //     }
    // );

    const { mutate: updateZinterviewSettingsMutation, isPending: isUpdatePending } = useMutationData(
        ["UpdateZinterviewOrganization"],
        (data) => updateZinterviewSettings(data),
        "get-organizations",
        (data) => {
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
                    description: "Error updating Zinterview settings",
                });
            }
        }
    );

    const onSubmit = (data: { apiKey?: string }) => {
        updateZinterviewSettingsMutation({
            orgId: organizationId,
            apiKey: data.apiKey,
        });
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
                    Zinterview Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Zinterview Settings</DialogTitle>
                    <DialogDescription>Update your zinterview API_KEY.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label htmlFor="apiKey">API_KEY</Label>
                            <Input
                                id="apiKey"
                                placeholder="Enter your Zinterview API Key"
                                {...register("apiKey")}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex w-full justify-between">
                        {/* <Button
                            variant="outline"
                            style={{
                                borderColor: "rgba(107, 114, 128, 1)",
                            }}
                            onClick={() => setAlreadyHaveOne(!alreadyHaveOne)}
                        >
                            {alreadyHaveOne ? "Don't have one?" : "Already have one?"}
                        </Button> */}
                        <div></div>
                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isUpdatePending ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ZinterviewSettings;
