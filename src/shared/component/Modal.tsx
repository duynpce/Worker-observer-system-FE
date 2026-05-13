import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, type ReactNode } from "react";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	children?: ReactNode;
	innerClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Modal = ({
	isOpen,
	onClose,
	title,
	className,
	innerClassName,
	children,
	...props
}: ModalProps) => {
	// Lock background scroll while modal is open.
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	return (
		// Headless UI handles close on outside click and Escape via onClose.
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel
					className={clsx(
						"relative flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-2xl",
						className
					)}
					{...props}
				>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close modal"
						className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
					>
						{/* Exit button */}
						X
					</button>

					{title && (
						<DialogTitle className="mb-4 w-full pr-10 text-left text-xl font-semibold text-gray-900">
							{title}
						</DialogTitle>
					)}

					<div className={clsx("flex w-full flex-col", innerClassName)}>{children}</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

export default Modal;
