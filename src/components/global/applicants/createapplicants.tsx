"use client";

import { createApplicants } from "@/actions/applicants";
// import { createOpening } from "@/actions/opening";
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
// import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";

interface Props {
    openingId: string;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
}

const CreateApplicants = (props: Props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { register, handleSubmit } = useForm<FormData>();

    const { mutate, isPending } = useMutationData(
        ["CreateApplicant"],
        (data) => createApplicants(data),
        "get-opening-" + props.openingId,
        () => {
            // toast({
            //     title:"Success",
            //     description: "Opening created successfully",
            // });
            setIsDialogOpen(false);
        }
    );

    const onSubmit = (data: { firstName: string; lastName: string; email: string }) => {
        mutate({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            openingId: props.openingId,
        });
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    // variant="outline"
                    className="bg-black hover:bg-black rounded-md text-white"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add Applicant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Candidate</DialogTitle>
                    <DialogDescription>Fill in the details to create a new candidate.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label
                                htmlFor="firstName"
                                className="w-[12ch]"
                            >
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                placeholder="First Name"
                                {...register("firstName")}
                            />
                        </div>
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label
                                htmlFor="lastName"
                                className="w-[12ch]"
                            >
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                placeholder="Last Name"
                                {...register("lastName")}
                            />
                        </div>
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label
                                htmlFor="email"
                                className="w-[12ch]"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Email"
                                {...register("email")}
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

export default CreateApplicants;
