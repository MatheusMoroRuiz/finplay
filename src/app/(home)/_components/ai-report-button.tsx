"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon, FileDownIcon } from "lucide-react";
import { generateAiReport } from "../_actions/generate-ai-report";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import Markdown from "react-markdown";
import Link from "next/link";

// PDF libs
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AiReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
  userName: string;
}

export default function AiReportButton({
  hasPremiumPlan,
  month,
  userName,
}: AiReportButtonProps) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerateReportClick() {
    try {
      setLoading(true);
      const result = await generateAiReport({ month });
      setReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------------
  // PREMIUM PDF
  // -----------------------------------------------
  const generatePdf = () => {
    if (!report) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;

    // HEADER
    doc.setFillColor("#0f0f0f");
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setFontSize(26);
    doc.setTextColor("#4ade80");
    doc.text("FinPlay — Relatório IA", 40, 50);

    // CONTENT
    autoTable(doc, {
      startY: 100,
      margin: 40,
      head: [["Relatório Financeiro Personalizado"]],
      styles: { fontSize: 12, cellPadding: 8, textColor: "#222" },
      headStyles: { fillColor: "#4ade80", textColor: "#fff", fontSize: 14 },
      body: report.split("\n").map((line) => [line]),
    });

    // FOOTER
    const date = new Date().toLocaleDateString("pt-BR");
    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text(
      `Gerado em ${date} — Usuário: ${userName}`,
      40,
      doc.internal.pageSize.height - 30
    );

    doc.save(`Relatorio_FinPlay_${date}.pdf`);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setReport(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          Relatório IA
          <BotIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[650px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Relatório IA
              </DialogTitle>
              <DialogDescription>
                Inteligência artificial analisará suas transações e criará um
                relatório completo sobre sua vida financeira.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="prose prose-invert max-h-[400px] text-white">
              {report ? (
                <Markdown>{report}</Markdown>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Clique em <b>Gerar relatório</b> para criar sua análise
                  financeira.
                </p>
              )}
            </ScrollArea>

            <DialogFooter className="flex justify-between mt-4">
              <DialogClose asChild>
                <Button variant="ghost">Fechar</Button>
              </DialogClose>

              <div className="flex gap-3">
                {/* PDF BUTTON */}
                {report && (
                  <Button variant="destructive" onClick={generatePdf}>
                    <FileDownIcon className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                )}

                {/* GENERATE BUTTON */}
                <Button onClick={handleGenerateReportClick} disabled={loading}>
                  {loading && <Loader2Icon className="animate-spin mr-2" />}
                  Gerar relatório
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Apenas usuários premium podem gerar relatórios inteligentes.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Assinar Premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
