import { z } from "zod";

export const CreateDocumentDTO = z.object({
  projectName: z.string({ required_error: "projectName wajib diisi" }).min(3, "projectName minimal 3 karakter"),
  documentTitle: z.string({ required_error: "documentTitle wajib diisi" }).min(3, "documentTitle minimal 3 karakter"),
  submissionDate: z.string().datetime("Format tanggal tidak valid (harus standard ISO 8601)").optional(),
  status: z.enum(["UNDER_REVIEW", "APPROVED", "REJECTED"], { message: "Status tidak valid" }).optional(),
});
