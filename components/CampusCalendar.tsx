"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type HolidayEvent = {
  date: string;
  title: string;
};

const holidayEvents: HolidayEvent[] = [
  { date: "2026-01-01", title: "Año Nuevo" },
  { date: "2026-02-05", title: "Constitución" },
  { date: "2026-03-16", title: "Natalicio de Benito Juárez" },
  { date: "2026-05-01", title: "Día del Trabajo" },
  { date: "2026-09-16", title: "Independencia de México" },
  { date: "2026-11-16", title: "Revolución Mexicana" },
  { date: "2026-12-25", title: "Navidad" },
];

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CampusCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedDateKey = useMemo(
    () => toLocalDateString(selectedDate),
    [selectedDate]
  );

  const eventsForSelectedDay = holidayEvents.filter(
    (event) => event.date === selectedDateKey
  );

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <h2 className="mb-4 text-lg font-bold text-espe-navy">
          Calendario escolar
        </h2>

        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";

            const key = toLocalDateString(date);
            const hasEvent = holidayEvents.some((event) => event.date === key);

            return hasEvent ? "espe-holiday" : "";
          }}
        />
      </div>

      <div className="rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <h2 className="text-lg font-bold text-espe-navy">
          Eventos del día
        </h2>

        <p className="mt-1 text-sm text-espe-muted">
          {selectedDate.toLocaleDateString("es-MX", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-4 space-y-3">
          {eventsForSelectedDay.length > 0 ? (
            eventsForSelectedDay.map((event) => (
              <div
                key={`${event.date}-${event.title}`}
                className="rounded-xl border border-espe-gold/30 bg-espe-gold/10 p-4"
              >
                <p className="font-semibold text-espe-navy">{event.title}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-espe-line p-4 text-sm text-espe-muted">
              No hay eventos registrados para este día.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}