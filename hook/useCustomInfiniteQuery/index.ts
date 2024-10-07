import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type FnProps = {
  queryKey: (string | undefined)[];
  signal: AbortSignal;
  pageParam: number;
  direction: any;
  meta: Record<string, unknown> | undefined;
};

type Props<T> = {
  key: (string | undefined)[];
  fn: (props: FnProps) => Promise<T[]>;
};

export default function <T>({ fn, key }: Props<T>) {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    status,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: key,
    queryFn: async (props) => await fn(props),
    initialPageParam: 1,
    getNextPageParam: function (lastPage, allPages) {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return { data, isLoading, isFetchingNextPage, status, hasNextPage, ref };
}
