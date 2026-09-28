export interface InGuidePaginationLink {
  label: string;
  href: string;
}

export interface InGuidePagination {
  prev?: InGuidePaginationLink;
  next?: InGuidePaginationLink;
}

/**
 * Keep prev/next within the current course. Starlight computes pagination from
 * the full sidebar, which would otherwise link from the end of one course into
 * the start of another — courses are meant to be self-contained here. Shared by
 * the title-block controls (`PageTitle.astro`) and the bottom pills
 * (`Pagination.astro`) so the two can never diverge.
 */
export function inGuidePagination(
  pagination: InGuidePagination,
  id: string,
): InGuidePagination {
  const course = String(id).replace(/^\/+/, "").split("/")[0];
  const sameCourse = (link?: InGuidePaginationLink) =>
    link != null && link.href.replace(/^\/+/, "").split("/")[0] === course;

  return {
    prev: sameCourse(pagination.prev) ? pagination.prev : undefined,
    next: sameCourse(pagination.next) ? pagination.next : undefined,
  };
}
