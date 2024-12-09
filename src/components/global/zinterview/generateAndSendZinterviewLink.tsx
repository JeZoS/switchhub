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
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
    openingDetails: any;
    selectedCandidates: any;
}

const GenerateAndSendZinterviewLink = ({ openingDetails, selectedCandidates }: Props) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { register, handleSubmit } = useForm<{ subject: string; body: string }>();

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                style={{
                                    border: "1px solid #333333",
                                }}
                                onClick={() => {
                                    if (selectedCandidates.length === 0) {
                                        toast({
                                            title: "Error",
                                            description: "Select candidates to generate Zinterview link",
                                        });
                                        return;
                                    }
                                    setIsDialogOpen(true);
                                }}
                            >
                                Generate Zinterview Link (
                                {
                                    openingDetails.applicants.filter((applicant: any) => {
                                        if (
                                            selectedCandidates.includes(applicant.id) &&
                                            applicant.ziInterviewStatus === "PENDING"
                                        ) {
                                            return applicant;
                                        }
                                    }).length
                                }
                                )
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Generate and mail Zinterview link to the selected Candidates.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[555px]">
                {/* <div className="absolute -top-6 left-0">
                    {selectedCandidates.length > 0 &&
                        selectedCandidates.map((candidate: any) => {
                            console.log(candidate);
                            return (
                                <div>
                                    {candidate}
                                </div>
                            );
                        })}
                </div> */}
                <DialogHeader>
                    <DialogTitle>Zinterview</DialogTitle>
                    <DialogDescription>
                        Generate and mail Zinterview link to the selected Candidates.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label
                                htmlFor="subject"
                                className="w-[7ch]"
                            >
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Mail Subject"
                                {...register("subject")}
                            />
                        </div>
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label
                                htmlFor="body"
                                className="w-[7ch]"
                            >
                                Body
                            </Label>
                            <Textarea
                                id="body"
                                placeholder="Mail Body"
                                {...register("body")}
                                rows={9}
                            />
                        </div>
                        {/* <div className="flex w-full gap-4 items-center">
                            <Label htmlFor="isTechnical">Is Technical?</Label>
                            <Input
                                id="isTechnical"
                                type="checkbox"
                                {...register("isTechnical")}
                                className="h-5 w-5"
                            />
                        </div> */}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled
                        // onClick={handleSubmit(onSubmit)}
                    >
                        {/* {isPending ? "Creating..." : "Create"} */}
                        {/* Create */}
                        Generate and Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GenerateAndSendZinterviewLink;
