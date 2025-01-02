"use client";

import { createOrganization } from "@/actions/organizations";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CreateOrganization = () => {
    const { register, handleSubmit } = useForm<{ name: string }>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { setOrgId } = useOrgStore((state) => state);
    const { toast } = useToast();
    const router = useRouter();
    const { mutate, isPending } = useMutationData(
        ["CreateOrganization"],
        (data) => createOrganization(data),
        "get-organizations",
        (resp) => {
            if (resp.status !== 200) {
                toast({
                    title: "Error",
                    description: resp.message,
                });
                return;
            }
            toast({
                title: "Success",
                description: "Organization created successfully",
            });
            setIsDialogOpen(false);
            setOrgId(resp.data);
            router.push("/app/organization/" + resp.data.id);
        }
    );

    const onSubmit = (data: { name: string }) => {
        mutate({
            name: data.name,
        });
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full"
                >
                    Create Organization
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>Fill in the details to create a new organization.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter Organization Name"
                                {...register("name")}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOrganization;
