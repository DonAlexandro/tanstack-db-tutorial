import { projectCollection } from "./main";
import { useLiveQuery } from "@tanstack/react-db";
import { cn } from "./lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Todos } from "./Todos";

function App() {
  const { data: projects } = useLiveQuery((q) =>
    q.from({ project: projectCollection })
  );

  return (
    <Accordion type="single" collapsible>
      {projects.map((project) => (
        <AccordionItem
          className={cn("m-2")}
          value={project.id}
          key={project.id}
        >
          <AccordionTrigger>{project.name}</AccordionTrigger>
          <AccordionContent>
            <Todos projectId={project.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default App;
