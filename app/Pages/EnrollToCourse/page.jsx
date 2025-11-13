import EnrollToCourseClient from "./EnrollToCourseClient";
import { defaultContent } from "@/lib/constants";

export default function EnrollToCoursePage({ bootcampCycles }) {
  const cycles =
    Array.isArray(bootcampCycles) && bootcampCycles.length > 0
      ? bootcampCycles
      : defaultContent.programOverview.bootcampCycles;

  return <EnrollToCourseClient bootcampCycles={cycles} />;
}
