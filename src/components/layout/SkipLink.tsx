import { cn } from "@/lib/utils";
import styles from "./SkipLink.module.css";

/**
 * First element in the tab order. Sits off-screen until focused, then slides in.
 * Positioned rather than `display: none` so it stays focusable.
 */
export function SkipLink() {
  return (
    <a href="#main" className={cn(styles.link, "mono")}>
      Skip to content
    </a>
  );
}
