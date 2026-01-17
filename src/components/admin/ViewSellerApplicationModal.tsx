import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mask = (v: string) => v?.replace(/\d(?=\d{4})/g, "*");

const ViewSellerApplicationModal = ({
  application,
  onClose,
  onApprove,
  onReject,
}: any) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <h2 className="text-xl font-bold">Seller Application</h2>
        </DialogHeader>

        {/* BASIC INFO */}
        <section className="space-y-2">
          <p><b>Name:</b> {application.full_name}</p>
          <p><b>WhatsApp:</b> {application.whatsapp}</p>
          <p>
            <b>GitHub:</b>{" "}
            <a href={application.github_profile} target="_blank" className="underline">
              Open
            </a>
          </p>
          {application.linkedin_profile && (
            <p>
              <b>LinkedIn:</b>{" "}
              <a href={application.linkedin_profile} target="_blank" className="underline">
                Open
              </a>
            </p>
          )}
        </section>

        <hr />

        {/* FILES */}
        <section className="space-y-2">
          <h3 className="font-semibold">Project Files</h3>

          {application.source_zip_url && (
            <a
              href={application.source_zip_url}
              target="_blank"
              className="text-indigo-600 underline"
            >
              Download Source ZIP
            </a>
          )}

          {application.documentation_url && (
            <a
              href={application.documentation_url}
              target="_blank"
              className="text-emerald-600 underline"
            >
              Download Documentation
            </a>
          )}

          {application.github_repo_url && (
            <a
              href={application.github_repo_url}
              target="_blank"
              className="text-gray-600 underline"
            >
              Open GitHub Repository
            </a>
          )}
        </section>

        <hr />

        {/* KYC */}
        <section className="space-y-1">
          <h3 className="font-semibold">KYC</h3>
          <p>PAN: {application.pan_number}</p>
          <p>Aadhaar: {mask(application.aadhaar_number)}</p>
        </section>

        <hr />

        {/* BANK */}
        <section className="space-y-1">
          <h3 className="font-semibold">Bank</h3>
          <p>Account Name: {application.bank_account_name}</p>
          <p>IFSC: {application.bank_ifsc}</p>
          <p>Account No: {mask(application.bank_account_number)}</p>
        </section>

        <hr />

        {/* STATUS */}
        <div className="flex items-center justify-between mt-6">
          <Badge>{application.status}</Badge>

          {application.status === "pending" && (
            <div className="flex gap-3">
              <Button variant="destructive" onClick={onReject}>
                Reject
              </Button>
              <Button onClick={onApprove}>
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSellerApplicationModal;
