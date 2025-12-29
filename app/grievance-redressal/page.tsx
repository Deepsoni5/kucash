import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GrievanceRedressalContent } from "@/components/grievance-redressal-content";

export const metadata = {
  title: "Grievance Redressal Policy | KuCash",
  description:
    "File complaints and grievances with our dedicated Nodal Officer. Get resolution within 14 days or escalate to RBI Ombudsman.",
};

export default function GrievanceRedressalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <GrievanceRedressalContent />
      </main>
      <Footer />
    </>
  );
}
