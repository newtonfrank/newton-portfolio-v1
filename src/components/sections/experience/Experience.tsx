import { achievements, education, experience } from "@/content/about";
import { cn } from "@/lib/utils";
import styles from "./Experience.module.css";

/**
 * The credibility section the editorial route previously dropped. Holds the
 * `#about` anchor (moved off the Intro pitch, which only masqueraded as an
 * about). Experience is the main column; education and highlights sit in a
 * quieter rail beside it.
 */
export function Experience() {
  return (
    <section id="about" className={styles.section}>
      <header className={styles.head}>
        <p className={cn(styles.eyebrow, "mono")}>Experience</p>
        <h2 className={styles.heading}>Two internships, shipped to production.</h2>
      </header>

      <div className={styles.layout}>
        <ol className={styles.jobs}>
          {experience.map((job) => (
            <li key={job.company} className={styles.job}>
              <div className={styles.jobHead}>
                <div>
                  <h3 className={styles.role}>{job.role}</h3>
                  <p className={styles.company}>{job.company}</p>
                </div>
                <span className={cn(styles.date, "mono")}>{job.date}</span>
              </div>
              <ul className={styles.points}>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <aside className={styles.side}>
          <div className={styles.block}>
            <p className={cn(styles.sideLabel, "mono")}>Education</p>
            {education.map((entry) => (
              <div key={entry.school} className={styles.edu}>
                <p className={styles.school}>{entry.school}</p>
                <p className={styles.degree}>{entry.degree}</p>
                <p className={cn(styles.eduMeta, "mono")}>
                  {entry.date} · {entry.note}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.block}>
            <p className={cn(styles.sideLabel, "mono")}>Highlights</p>
            <ul className={styles.highlights}>
              {achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
