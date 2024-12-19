"use client";

// import { createOpening } from "@/actions/opening";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";

const CreateOrganization = () => {
    const { register, handleSubmit } = useForm<{ name: string }>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const { mutate, isPending } = useMutationData(
        ["CreateOrganization"],
        (data) => createOrganization(data),
        "get-organizations",
        () => {
            toast({
                title: "Success",
                description: "Organization created successfully",
            });
            setIsDialogOpen(false);
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
                    variant="default"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Create Organization
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Organizatin</DialogTitle>
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
