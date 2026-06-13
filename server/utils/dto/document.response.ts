import { z } from "zod";

export const DocumentResponseDTO = z.object({
  id: z.string(),
  projectName: z.string(),
  documentTitle: z.string(),
  submittedBy: z.string(),
  submissionDate: z.string(),
  status: z.string(),
  createAt: z.string(),
  updateAt: z.string(),
});

export const DocumentListResponseDTO = z.array(DocumentResponseDTO);
