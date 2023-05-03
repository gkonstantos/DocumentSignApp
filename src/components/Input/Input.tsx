import React, { useState } from "react";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { AnimatePresence, motion } from "framer-motion";

export type InputProps =
	& Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "className">
	& {
		error?: boolean;
		endAdornment?: React.ReactNode;
		startAdornment?: React.ReactNode;
	};

export const Input = React.forwardRef<HTMLInputElement, React.PropsWithChildren<InputProps>>((props, ref) => {
	const {
		value,
		onChange: _onChange,
		type: _type,
		error = false,
		placeholder,
		readOnly,
		disabled,
		endAdornment,
		startAdornment,
		...rest
	} = props;

	const isControlled: boolean = !(typeof value === "undefined");
	const isPassword: boolean = _type === "password";
	const [visible, setVisible] = useState<boolean>();
	const [focused, setFocused] = useState<boolean>();

	const type = isPassword && visible ? "text" : _type;

	const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		_onChange && _onChange(event);
	}, [_onChange]);

	if (type === "radio") {
		return (
			<div className="flex justify-between items-center w-full overflow-x-hidden">
				<label
					htmlFor={props.name}
					className={clsx(
						"pointer-events-none",
						"text-lg",
					)}
				>
					{placeholder} {props.required === true && "*"}
				</label>
				<motion.button
					className=" h-5 w-5 p-0.5 rounded-full border-2 border-[#202442] dark:border-zinc-50"
					initial="initial"
					animate="animate"
					variants={{
						initial: {
							x: "100%"
						},
						animate: {
							x: 0,
						}
					}}
					onClick={() => props.onChange && props.onChange({} as any)}
				>
					<AnimatePresence>
						{props.checked && (
							<motion.div
								className="h-full w-full bg-[#202442] dark:bg-zinc-50 rounded-full"
								initial="initial"
								animate="animate"
								exit="exit"
								variants={{
									initial: {
										scale: 0,
										opacity: 0,
									},
									animate: {
										scale: 1,
										opacity: 1,
									},
									exit: {
										scale: 0,
										opacity: 0,
									}
								}}
							/>
						)}
					</AnimatePresence>
				</motion.button>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col relative bg-inherit"
			onFocus={(e) => {
				setFocused(true);
			}}
			onBlur={(e) => {
				setFocused(false);
			}}
		>
			<div className="inline-flex">
				<input
					className={clsx(
						"block peer bg-inherit",
						"pb-0.5 pt-5 w-full text-md",
						"font-semibold dark:text-normal",
						"appearance-none outline-none ring-0"
					)}
					ref={ref}
					type={type}
					value={value}
					onChange={onChange}
					placeholder={` `}
					disabled={disabled}
					readOnly={readOnly}
					onFocus={(e) => {
						props.onFocus && props.onFocus(e);
					}}
					onBlur={(e) => {
						props.onBlur && props.onBlur(e);
					}}
					{...rest}
				/>
				<AnimatePresence>
					{isPassword && disabled !== true && !isEmpty(value) && (
						<motion.button
							type={"button"}
							initial="initial"
							animate="animate"
							exit="exit"
							variants={{
								initial: {
									scale: 0,
								},
								animate: {
									scale: 1,
								},
								exit: {
									scale: 0,
								}
							}}
							className={clsx(
								"bottom-0 right-0 pt-5",
								"h-full grid place-items-center",
							)}
							onClick={() => setVisible(!visible)}
						>
							<img
								width={20}
								src={visible ? new URL(`/assets/eye.svg`, import.meta.url).href : new URL(`/assets/eye-off.svg`, import.meta.url).href}
							/>
						</motion.button>
					)}
					{endAdornment}
				</AnimatePresence>
				<label
					htmlFor={props.name}
					title={props.placeholder}
					className={clsx(
						"absolute left-0 pointer-events-none",
						"text-md duration-300 transform -translate-y-[100%] scale-75 top-4 z-1 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75",
						"peer-focus:-translate-y-[100%]",
						"after:block after:h-0 after:invisible after:content-[attr(title)] after:font-semibold after:overflow-hidden after:opacity-0",
						props.required && "before:block before:absolute before:top-0 before:-right-2 before:content-['*'] before:font-semibold before:overflow-hidden",
						error && [
							focused && "text-red-700",
							!focused && "text-red-500",
						],
						focused && "font-semibold"
					)}
				>
					<p className="flex-1 shrink-0">
						{placeholder}
					</p>
				</label>
			</div>
			<motion.div
				className={clsx(
					"relative h-0.5 mt-1 w-full bg-gray-300",
					error && "bg-red-400"
				)}
				initial="closed"
				animate={(disabled !== true) ? "open" : "initial"}
				variants={{
					open: {
						opacity: 1,
						width: "100%",
						transition: {
							ease: "linear"
						}
					},
					closed: {
						opacity: 0,
						width: 0
					}
				}}
			>
				<AnimatePresence>
					{focused && (
						<motion.div
							className={clsx(
								"absolute h-full w-full top-0",
								error && "bg-red-700",
								!error && "bg-gray-400",
							)}
							initial="initial"
							animate="animate"
							exit="initial"
							variants={{
								initial: {
									x: "100%",
									opacity: 0,
									width: 0,
								},
								animate: {
									opacity: 1,
									width: "100%",
									x: 0,
									transition: {
										ease: "linear"
									}
								},
								exit: {
									opacity: 0,
									width: 0,
									x: "-100%",
									transition: {
										ease: "linear"
									}
								}
							}}
						/>
					)}
				</AnimatePresence>
			</motion.div>

			
		</div>
	);
});


export default Input;