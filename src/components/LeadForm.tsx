"use client";

import { useState, type ChangeEvent } from "react";
import { countryOptions, stateOptionsByCountry } from "@/data/salesforceLeadOptions";

export function LeadForm() {
  const [country, setCountry] = useState("");
  const countryStates = stateOptionsByCountry[country];
  const [usesSalesforce, setUsesSalesforce] = useState("");

  return (
    <form
      action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DQE00000FXBNR"
      method="POST"
      className="mt-10 space-y-5 rounded-2xl border border-black/5 bg-white/90 p-8 shadow-sm"
    >
      <input type="hidden" name="oid" value="00DQE00000FXBNR" />
      <input type="hidden" name="retURL" value="https://the-handover.github.io/Site/thank-you/" />
      <input type="hidden" name="lead_source" value="Web" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" name="first_name" autoComplete="given-name" maxLength={40} required />
        <Field label="Last Name" name="last_name" autoComplete="family-name" maxLength={80} required />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" maxLength={80} required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Country"
          name="country_code"
          options={countryOptions}
          required
          value={country}
          onChange={setCountry}
        />
        {countryStates ? (
          <Select key={country} label="State/Province" name="state_code" options={countryStates} required />
        ) : (
          <Field key={country} label="State/Province" name="state_code" maxLength={80} required />
        )}
      </div>
      <Field
        label="LinkedIn profile"
        name="00NQE00000bzmH1"
        autoComplete="url"
        maxLength={255}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="How have you used Claude before?"
          name="00NQE00000bzmSD"
          required
          options={[
            { value: "", label: "Select…" },
            { value: "Used for work", label: "Used for work" },
            { value: "Used personally", label: "Used personally" },
            { value: "Have not tried yet", label: "Have not tried yet" },
          ]}
        />
        <Select
          label="Have you used Claude Code?"
          name="00NQE00000bzmTp"
          required
          options={[
            { value: "", label: "Select…" },
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
            { value: "Not sure", label: "Not sure" },
          ]}
        />
      </div>
      {/*
        00NQE00000bzmLm is a Checkbox-type field in Salesforce, which Web-to-Lead
        only ever reads as present = checked, absent = unchecked — it has no
        "false" value. So this select is UI-only (no name, never submitted) and
        the hidden input below is what actually reaches Salesforce, and only
        when the answer is "Yes".
      */}
      <Select
        label="Do you use Salesforce in your day-to-day work?"
        id="uses_salesforce"
        required
        value={usesSalesforce}
        onChange={setUsesSalesforce}
        options={[
          { value: "", label: "Select…" },
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />
      {usesSalesforce === "yes" && <input type="hidden" name="00NQE00000bzmLm" value="1" />}
      <div>
        <label htmlFor="00NQE00000bzirf" className="block text-sm font-medium text-foreground">
          What&apos;s your current role?
          <span className="text-pbc-orange-dark"> *</span>
        </label>
        <textarea
          id="00NQE00000bzirf"
          name="00NQE00000bzirf"
          rows={2}
          placeholder="e.g. Salesforce Admin at a nonprofit, Slack consultant, developer"
          required
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-foreground focus:border-pbc-blue focus:outline-none focus:ring-2 focus:ring-pbc-blue/30"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Why are you interested, and what&apos;s slowing you down at work?
          <span className="text-pbc-orange-dark"> *</span>
        </label>
        <p className="mt-1 text-sm text-foreground/60">
          Tell us the pain points you&apos;d love Claude to take off your plate. We use this to
          shape your cohort.
        </p>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="e.g. Writing user stories takes hours, I spend every Friday on release notes…"
          required
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-foreground focus:border-pbc-blue focus:outline-none focus:ring-2 focus:ring-pbc-blue/30"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-pbc-orange px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-pbc-orange-dark"
      >
        Submit
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  maxLength,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-pbc-orange-dark"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-foreground focus:border-pbc-blue focus:outline-none focus:ring-2 focus:ring-pbc-blue/30"
      />
    </div>
  );
}

function Select({
  label,
  name,
  id,
  options,
  required,
  value,
  onChange,
}: {
  label: string;
  name?: string;
  id?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const isControlled = value !== undefined;
  const fieldId = id ?? name;
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-pbc-orange-dark"> *</span>}
      </label>
      <select
        id={fieldId}
        name={name}
        required={required}
        {...(isControlled
          ? { value, onChange: (e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) }
          : { defaultValue: "" })}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-foreground focus:border-pbc-blue focus:outline-none focus:ring-2 focus:ring-pbc-blue/30"
      >
        {options.map((opt) => (
          <option key={`${opt.value}-${opt.label}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
