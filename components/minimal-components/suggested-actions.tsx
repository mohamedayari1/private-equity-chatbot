import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function SuggestedActions() {
  const suggestedActions = [
    {
      title: "Analyze a company",
      label: "based on financial metrics and market position",
      action:
        "Analyze a company's financial performance and investment potential",
    },
    {
      title: "Market trends analysis",
      label: "for specific sectors or industries",
      action:
        "Provide insights on current market trends and sector performance",
    },
    {
      title: "Evaluate a potential deal",
      label: "based on valuation and risk factors",
      action:
        "Assess the viability and risks of a potential investment opportunity",
    },
    {
      title: "Ask an investment question",
      label: "like portfolio strategy or market timing",
      action:
        "Answer a specific question about investment strategy or market conditions",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant={"ghost"}
            onClick={() => console.log(suggestedAction)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
