import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    console.log('API_PATHS.cart: ', API_PATHS.cart);
    const res = await axios.get<AxiosResponse<CartItem[]>>(
      `${API_PATHS.cart}/profile/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
    return res.data.data;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
