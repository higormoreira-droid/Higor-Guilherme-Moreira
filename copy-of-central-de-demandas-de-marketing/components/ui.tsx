import * as React from "react";

// Utility for class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-input bg-background hover:bg-gray-100 hover:text-accent-foreground",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      link: "text-blue-600 underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    return <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />;
  }
);
Button.displayName = "Button";

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Textarea ---
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// --- Label ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  )
);
Label.displayName = "Label";

// --- Card ---
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-white text-gray-950 shadow-sm", className)} {...props} />
));
Card.displayName = "Card";
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";
export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));
CardDescription.displayName = "CardDescription";
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

// --- Checkbox ---
export const Checkbox = React.forwardRef<HTMLButtonElement, { checked?: boolean; onCheckedChange?: (checked: boolean) => void } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
        checked ? "bg-blue-600 border-blue-600" : "border-gray-400",
        className
      )}
      {...props}
    >
      {checked && (
        <span className="flex items-center justify-center text-current">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </button>
  )
);
Checkbox.displayName = "Checkbox";

// --- Switch ---
export const Switch = React.forwardRef<HTMLButtonElement, { checked?: boolean; onCheckedChange?: (checked: boolean) => void } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      ref={ref}
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-600" : "bg-gray-200",
        className
      )}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
);
Switch.displayName = "Switch";

// --- Badge ---
export const Badge = ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }) => {
  const variants = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-gray-950 border-gray-200",
  };
  return <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />;
};

// --- Avatar ---
export const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
));
Avatar.displayName = "Avatar";
export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(({ className, ...props }, ref) => (
  <img ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";
export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-gray-100", className)} {...props} />
));
AvatarFallback.displayName = "AvatarFallback";

// --- Accordion ---
const AccordionContext = React.createContext<{ value?: string; onValueChange?: (value: string) => void }>({});
export const Accordion = ({ type, collapsible, value, onValueChange, children, className }: any) => {
  const [selectedValue, setSelectedValue] = React.useState(value || "");
  const handleValueChange = (val: string) => {
    if (collapsible && val === selectedValue) {
      setSelectedValue("");
      onValueChange?.("");
    } else {
      setSelectedValue(val);
      onValueChange?.(val);
    }
  };
  return (
    <AccordionContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};
export const AccordionItem = ({ value, children, className }: any) => {
  return (
    <div data-value={value} className={cn("border-b", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
           return React.cloneElement(child, { value } as any);
        }
        return child;
      })}
    </div>
  );
};
export const AccordionTrigger = ({ children, className, value }: any) => {
  const ctx = React.useContext(AccordionContext);
  const isOpen = ctx.value === value;
  return (
    <button
      onClick={() => ctx.onValueChange?.(value)}
      className={cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline", className)}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen ? "rotate-180" : "")}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
};
export const AccordionContent = ({ children, className, value }: any) => {
  const ctx = React.useContext(AccordionContext);
  if (ctx.value !== value) return null;
  return <div className={cn("overflow-hidden text-sm transition-all pb-4 pt-0", className)}>{children}</div>;
};

// --- Alert ---
export const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" | "success" }>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";
export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";
export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

// --- Select ---
const SelectContext = React.createContext<any>(null);
export const Select = ({ children, value, onValueChange }: any) => {
  const [open, setOpen] = React.useState(false);
  return <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>{children}</SelectContext.Provider>;
};
export const SelectTrigger = ({ children, className }: any) => {
  const { open, setOpen, value } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50"><path d="M4.93179 5.43179C4.75605 5.25605 4.75605 4.97113 4.93179 4.79539C5.10753 4.61965 5.39245 4.61965 5.56819 4.79539L7.49999 6.72718L9.43179 4.79539C9.60753 4.61965 9.89245 4.61965 10.0682 4.79539C10.2439 4.97113 10.2439 5.25605 10.0682 5.43179L7.81819 7.68179C7.73379 7.76619 7.61933 7.8136 7.49999 7.8136C7.38064 7.8136 7.26618 7.76619 7.18179 7.68179L4.93179 5.43179Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
    </button>
  );
};
export const SelectValue = ({ placeholder }: any) => {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};
export const SelectContent = ({ children, className }: any) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md animate-in fade-in-80 mt-1 w-full max-w-[var(--radix-select-trigger-width)]", className)}>
      <div className="p-1">{children}</div>
    </div>
  );
};
export const SelectItem = ({ value, children, className }: any) => {
  const { onValueChange, setOpen } = React.useContext(SelectContext);
  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    >
      {children}
    </div>
  );
};

// Stub components to satisfy imports
export const SelectGroup = ({ children }: any) => <>{children}</>;
export const SelectLabel = ({ children }: any) => <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>;
export const SelectScrollDownButton = () => null;
export const SelectScrollUpButton = () => null;
export const SelectSeparator = () => <div className="-mx-1 my-1 h-px bg-muted" />;
export const Separator = ({ className }: any) => <div className={cn("shrink-0 bg-gray-200 h-[1px] w-full", className)} />;
export const Skeleton = ({ className }: any) => <div className={cn("animate-pulse rounded-md bg-muted", className)} />;

// --- Table ---
export const Table = ({ className, ...props }: any) => <div className="w-full overflow-auto"><table className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>;
export const TableHeader = ({ className, ...props }: any) => <thead className={cn("[&_tr]:border-b", className)} {...props} />;
export const TableBody = ({ className, ...props }: any) => <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
export const TableFooter = ({ className, ...props }: any) => <tfoot className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} />;
export const TableRow = ({ className, ...props }: any) => <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />;
export const TableHead = ({ className, ...props }: any) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />;
export const TableCell = ({ className, ...props }: any) => <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />;
export const TableCaption = ({ className, ...props }: any) => <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />;

// --- Tabs ---
const TabsContext = React.createContext<any>(null);
export const Tabs = ({ value, onValueChange, children }: any) => {
    const [tab, setTab] = React.useState(value);
    return <TabsContext.Provider value={{ value: value || tab, onValueChange: onValueChange || setTab }}>{children}</TabsContext.Provider>;
};
export const TabsList = ({ children, className }: any) => <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>{children}</div>;
export const TabsTrigger = ({ value, children, className }: any) => {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext);
  const isActive = currentValue === value;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", isActive ? "bg-background text-foreground shadow-sm" : "", className)}
    >
      {children}
    </button>
  );
};
export const TabsContent = ({ value, children }: any) => {
  const { value: currentValue } = React.useContext(TabsContext);
  if (currentValue !== value) return null;
  return <div>{children}</div>;
};

// --- Tooltip ---
export const TooltipProvider = ({ children }: any) => <>{children}</>;
export const Tooltip = ({ children }: any) => <div className="group relative inline-block">{children}</div>;
export const TooltipTrigger = ({ children, asChild }: any) => asChild ? children : <button>{children}</button>;
export const TooltipContent = ({ children }: any) => (
  <div className="absolute z-50 overflow-hidden rounded-md border bg-black text-white px-3 py-1.5 text-xs shadow-md animate-in fade-in-0 zoom-in-95 hidden group-hover:block top-full mt-2 w-max max-w-xs">
    {children}
  </div>
);

// --- AlertDialog (Mock) ---
export const AlertDialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden" role="dialog">
        {React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, { onOpenChange } as any) : child)}
      </div>
    </div>
  );
};
export const AlertDialogContent = ({ children }: any) => <div className="p-6">{children}</div>;
export const AlertDialogHeader = ({ children }: any) => <div className="flex flex-col space-y-2 text-center sm:text-left">{children}</div>;
export const AlertDialogFooter = ({ children }: any) => <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">{children}</div>;
export const AlertDialogTitle = ({ children }: any) => <h2 className="text-lg font-semibold">{children}</h2>;
export const AlertDialogDescription = ({ children }: any) => <p className="text-sm text-muted-foreground">{children}</p>;
export const AlertDialogAction = ({ children, onClick }: any) => <Button onClick={onClick}>{children}</Button>;
export const AlertDialogCancel = ({ children, onClick }: any) => {
    // In a real app, we'd need to wire this to close the dialog via context
    return <Button variant="outline" onClick={onClick}>{children}</Button>; 
}
export const AlertDialogOverlay = () => null;
export const AlertDialogPortal = ({ children }: any) => <>{children}</>;
export const AlertDialogTrigger = ({ children }: any) => <>{children}</>;