import {
    MutationFunction,
    MutationKey,
    useMutation,
    // useMutationState,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
    mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    queryKey?: string,
    onSuccess?: (data: any) => void
) => {
    const client = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey,
        mutationFn,
        onSuccess(data) {
            if (onSuccess) {
                onSuccess(data);
            }
            return toast(data?.success === 200 ? "success" : "error", {
                description: data?.data,
            });
        },
        onSettled: async () => {
            return await client.invalidateQueries({ queryKey: [queryKey] });
        },
    });
    return { mutate, isPending};
};