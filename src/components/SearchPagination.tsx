import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/** First page, last page, and a window around the current one, with "ellipsis" marking the gaps. */
function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  const pages = new Set<number>([1, total]);
  for (let page = current - 1; page <= current + 1; page++) {
    if (page >= 1 && page <= total) pages.add(page);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let previous: number | null = null;
  for (const page of sorted) {
    if (previous !== null && page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

const activeLinkClass =
  "border-brand-accent bg-brand-surface text-brand-accent hover:bg-brand-surface";
const linkClass =
  "border-brand-divider bg-brand-surface text-brand-text/70 hover:bg-brand-text/7 hover:text-brand-text";

export default function SearchPagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (page: number) => `${basePath}?page=${page}`;
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={href(Math.max(1, currentPage - 1))}
            aria-disabled={isFirst}
            text=""
            className={`${linkClass} ${isFirst ? "pointer-events-none opacity-50" : ""} p-0`}
          />
        </PaginationItem>

        <div className="mx-2 flex items-center gap-1">
          {getPageNumbers(currentPage, totalPages).map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-brand-text/50" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href={href(page)}
                  isActive={page === currentPage}
                  className={page === currentPage ? activeLinkClass : linkClass}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
        </div>

        <PaginationItem>
          <PaginationNext
            href={href(Math.min(totalPages, currentPage + 1))}
            aria-disabled={isLast}
            text=""
            className={`${linkClass} ${isLast ? "pointer-events-none opacity-50" : ""} p-0`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
