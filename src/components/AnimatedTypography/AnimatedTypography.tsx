// import { CommonComponentProps, setDisplayName } from "@saicongames/retain";
// import { Nullable } from "@saicongames/tulip";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { isEmpty } from "lodash";
import { CSSProperties } from "react";

export type CommonComponentProps = {
    className?: string;
    style?: CSSProperties;
};



export type AnimatedTypographyProps = Pick<
  CommonComponentProps,
  "className"
> & {
  /**
   * @default "md"
   */
  size?:
    | "xs"
    | "sm"
    | "md"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";
  direction?: "top" | "left" | "right" | "bottom";
  letterProps?: Pick<CommonComponentProps, "className">;
  children?: string;
  /**
   * @default .02
   */
  staggerChildren?: number;
  /**
   * @default undefined
   */
  delay?: number;
  loading?: boolean;
};

export const AnimatedTypography: React.FunctionComponent<
  AnimatedTypographyProps
> = (props) => {
  const {
    children = "&nbsp;",
    size = "md",
    direction = "bottom",
    letterProps = {},
    loading = false,
    className,
    staggerChildren = 0.02,
    delay,
  } = props;

  const animatedAxis: string = ["left", "right"].includes(direction)
    ? "x"
    : "y";
  let splitWords: Array<string> = [];
  if (children) {
    children
      .split(" ")
      .forEach(
        (sp) => (splitWords = [...splitWords, ...[...sp.split(""), "&nbsp;"]])
      );
    splitWords.pop();
  }

  return (
    <AnimatePresence>
      {splitWords && !isEmpty(splitWords) && (
        <motion.div
          className={clsx(
            "flex",
            className,
            `text-${size}`,
            loading && "bg-gray-300 rounded-3xl"
          )}
          initial="initial"
          animate="animate"
          variants={{
            initial: {
              opacity: 0,
            },
            animate: {
              opacity: 1,
              transition: {
                delayChildren: delay,
                staggerChildren,
              },
            },
          }}
        >
          {splitWords.map((sp, index) => (
            <motion.span
              key={index}
              className={clsx(
                loading && "text-transparent",
                "inline-flex",
                letterProps.className
              )}
              variants={{
                initial: {
                  [animatedAxis]: `${
                    ["top", "left"].includes(direction) ? "-" : ""
                  }100%`,
                  opacity: 0,
                },
                animate: {
                  [animatedAxis]: 0,
                  opacity: 1,
                },
              }}
              dangerouslySetInnerHTML={{ __html: sp }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedTypography;
