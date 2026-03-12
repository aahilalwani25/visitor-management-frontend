import React, { Dispatch, SetStateAction } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { CreateUserFormData } from "@/modules/visitor/visitor";

interface Props {
  userOutput: CreateUserFormData | null;
  setUserOutput: Dispatch<SetStateAction<CreateUserFormData | null>>;
  onCancel: ()=> void | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (data: CreateUserFormData) => void;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

// ── Fields to render (check_in excluded) ────────────────────────────────────
const FIELD_META: {
  key: keyof Omit<CreateUserFormData, "check_in" | "user_id">;
  label: string;
  icon: string;
  placeholder?: string;
}[] = [
  { key: "full_name", label: "Full Name", icon: "👤" },
  {
    key: "cnic",
    label: "CNIC",
    icon: "🪪",
    placeholder: "e.g. 42101-1234567-1",
  },
  { key: "card_type", label: "Card Type", icon: "💳" },
  { key: "dl_number", label: "DL Number", icon: "🚗" },
  { key: "company_name", label: "Company", icon: "🏢" },
  { key: "phone_number", label: "Phone", icon: "📞" },
  { key: "email", label: "Email", icon: "✉️" },
  { key: "website_url", label: "Website", icon: "🌐" },
];

type CardType = "cnic" | "driving_license" | "visiting_card";

const FIELDS_BY_CARD_TYPE: Record<
  CardType,
  (keyof Omit<CreateUserFormData, "check_in" | "user_id">)[]
> = {
  cnic: ["full_name", "cnic", "card_type"],
  driving_license: ["full_name", "dl_number", "card_type"],
  visiting_card: [
    "full_name",
    "cnic",
    "phone_number",
    "company_name",
    "website_url",
    "email",
    "card_type",
  ],
};

function ScanOutputConfirmation({
  userOutput,
  setUserOutput,
  isOpen,
  onOpenChange,
  onConfirm,
  isEditing,
  setIsEditing,
  onCancel,
}: Props) {
  const handleConfirm = () => {
    if (userOutput) onConfirm(userOutput);
  };
  const handleFieldChange = (key: keyof CreateUserFormData, value: string) => {
    setUserOutput((prev) =>
      prev ? { ...prev, [key]: value === "" ? null : value } : prev,
    );
  };

  // Only render rows that have a non-null value in view mode
  const visibleFields = FIELD_META.filter(({ key }) =>
    FIELDS_BY_CARD_TYPE[userOutput?.card_type]?.includes(key),
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
      classNames={{
        wrapper: "fixed inset-0 z-[9999] flex items-center justify-center",
        backdrop: "fixed inset-0 bg-black/30 backdrop-blur-sm",
        base: "rounded-2xl overflow-hidden",
        closeButton: "hidden",
      }}
    >
      <ModalContent
        className="relative text-slate-800"
        style={{
          background: "#ffffff",
          fontFamily: "'DM Sans', 'Nunito', sans-serif",
          boxShadow:
            "0 20px 60px rgba(99,102,241,0.15), 0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        {/* Animated shimmer top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, #6366f1, #818cf8, #38bdf8, #6366f1)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />

        {/* Soft gradient wash — top-right */}
        <div
          className="absolute top-0 right-0 w-52 h-52 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.05))",
            borderRadius: "0 16px 0 100%",
          }}
        />

        {/* ── HEADER ── */}
        <ModalHeader className="flex flex-col gap-1 px-6 pt-7 pb-2 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-md"
              style={{
                background: "linear-gradient(90deg, #6366f1, #38bdf8)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              }}
            >
              {isEditing ? "✏️" : "🪪"}
            </div>
            <div>
              <p
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {isEditing ? "Edit Mode" : "Scan Result"}
              </p>
              <h2
                className="text-xl font-bold text-slate-800 leading-tight"
                style={{ letterSpacing: "-0.3px" }}
              >
                {isEditing ? "Edit Information" : "Confirm Information"}
              </h2>
            </div>
          </div>
        </ModalHeader>

        {/* ── BODY ── */}
        <ModalBody className="px-6 py-4 relative z-10">
          {isEditing ? (
            /* EDIT MODE — all fields shown */
            <div className="flex flex-col gap-4">
              {FIELD_META.map((f) => (
                <EditField
                  key={f.key}
                  label={f.label}
                  icon={f.icon}
                  placeholder={f.placeholder}
                  value={userOutput?.[f.key] ?? ""}
                  onChange={(val) => handleFieldChange(f.key, val)}
                />
              ))}
            </div>
          ) : (
            /* VIEW MODE — only non-null fields */
            <div className="flex flex-col gap-3">
              {visibleFields.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  No data available.
                </p>
              ) : (
                visibleFields.map((f) => (
                  <InfoRow
                    key={f.key}
                    label={f.label}
                    icon={f.icon}
                    value={String(userOutput?.[f.key] ?? "")}
                  />
                ))
              )}
              <p className="text-xs text-slate-400 mt-1 text-center">
                Please verify the scanned information before confirming.
              </p>
            </div>
          )}
        </ModalBody>

        {/* ── FOOTER ── */}
        <ModalFooter
          className="px-6 pb-6 pt-3 gap-2 relative z-10"
          style={{ borderTop: "1px solid rgba(99,102,241,0.08)" }}
        >
          {/* Cancel */}
          <Button
            variant="flat"
            onPress={onCancel}
            className="flex-1 font-semibold text-sm"
            style={{
              background: "#f8fafc",
              color: "#94a3b8",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              height: "42px",
            }}
          >
            Cancel
          </Button>

          {/* Edit / Done */}
          <Button
            variant="flat"
            onPress={() => setIsEditing((p) => !p)}
            className="flex-1 font-semibold text-sm"
            style={{
              background: isEditing
                ? "linear-gradient(90deg, #fef9c3, #fef3c7)"
                : "linear-gradient(90deg, #eef2ff, #e0f2fe)",
              color: isEditing ? "#d97706" : "#6366f1",
              border: `1px solid ${isEditing ? "#fcd34d" : "#c7d2fe"}`,
              borderRadius: "10px",
              height: "42px",
            }}
          >
            {isEditing ? "✓ Done" : "✏️ Edit"}
          </Button>

          {/* Confirm */}
          <Button
            onPress={handleConfirm}
            className="flex-1 font-bold text-sm text-white"
            style={{
              background: "linear-gradient(90deg, #6366f1, #38bdf8)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              borderRadius: "10px",
              height: "42px",
            }}
          >
            Confirm →
          </Button>
        </ModalFooter>

        <style>{`
          @keyframes shimmer {
            0%   { background-position: 0% 0%; }
            100% { background-position: 200% 0%; }
          }
        `}</style>
      </ModalContent>
    </Modal>
  );
}

/* ── Info Row (View Mode) ── */
function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "linear-gradient(90deg, #f8faff, #f0f7ff)",
        border: "1px solid rgba(99,102,241,0.1)",
      }}
    >
      <span className="text-base">{icon}</span>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-700 truncate">
          {value}
        </span>
      </div>
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg, #6366f1, #38bdf8)" }}
      />
    </div>
  );
}

/* ── Edit Field (Edit Mode) ── */
function EditField({
  label,
  value,
  icon,
  placeholder,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  icon: string;
  placeholder?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
        style={{
          background: "linear-gradient(90deg, #6366f1, #38bdf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <span style={{ WebkitTextFillColor: "initial" }}>{icon}</span> {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder ?? `Enter ${label}`}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl outline-none transition-all"
        style={{
          background: "linear-gradient(90deg, #f8faff, #f0f7ff)",
          border: "1.5px solid #c7d2fe",
          caretColor: "#6366f1",
        }}
        onFocus={(e) => {
          e.target.style.border = "1.5px solid #6366f1";
          e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1.5px solid #c7d2fe";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

export default ScanOutputConfirmation;
