import { backendApi } from "@/common/redux/backendApi";

const beginnerApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getBeginnerMessage: builder.query<string, void>({
      query: () => ({
        url: "/api/training/beginner",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetBeginnerMessageQuery } = beginnerApi;
