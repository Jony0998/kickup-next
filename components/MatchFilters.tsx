import React, { useState, useMemo } from "react";
import {
  Box,
  Chip,
  MenuItem,
  Menu,
  Popover,
  Typography,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WcIcon from "@mui/icons-material/Wc";
import SchoolIcon from "@mui/icons-material/School";
import { getSkillLevelLabel } from "@/lib/skillLevels";

export interface FilterOptions {
  location: string;
  dateRange: string;
  timeRange: string;
  gender: string;
  level: string;
  fieldType: string;
  priceRange: [number, number];
  availableSpots: string;
  sortBy: string;
  searchQuery: string;
  teamSize: string;
}

interface MatchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  /** When user picks a specific date from the calendar, pass it here for chip label and strip sync */
  selectedDateValue?: Date | null;
  /** Called when user selects a date (calendar) or clears (All Dates / presets) */
  onDateSelect?: (date: Date | null) => void;
}

const defaultFilters: FilterOptions = {
  location: "all",
  dateRange: "all",
  timeRange: "all",
  gender: "all",
  level: "all",
  fieldType: "all",
  priceRange: [0, 100000],
  availableSpots: "all",
  sortBy: "date",
  searchQuery: "",
  teamSize: "all",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MatchFilters({
  filters,
  onFiltersChange,
  onReset,
  selectedDateValue = null,
  onDateSelect,
}: MatchFiltersProps) {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [calendarView, setCalendarView] = useState(() => {
    const d = selectedDateValue || new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const handleClick = (key: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl({ ...anchorEl, [key]: event.currentTarget });
  };

  const handleClose = (key: string) => {
    setAnchorEl({ ...anchorEl, [key]: null });
  };

  const openDatePopover = Boolean(anchorEl["date"]);

  // When opening date popover, sync calendar view to selected date or today
  const handleDateChipClick = (e: React.MouseEvent<HTMLElement>) => {
    const next = !anchorEl["date"];
    setAnchorEl({ ...anchorEl, date: next ? e.currentTarget : null });
    if (next) {
      const d = selectedDateValue || new Date();
      setCalendarView({ year: d.getFullYear(), month: d.getMonth() });
    }
  };

  // Menu anchor keys (for closing): date menu uses 'date', filter key is 'dateRange'
  const getMenuAnchorKey = (filterKey: keyof FilterOptions): string =>
    filterKey === "dateRange" ? "date" : String(filterKey);

  const handleSelect = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
    handleClose(getMenuAnchorKey(key));
    if (key === "dateRange") onDateSelect?.(null);
  };

  const handleCalendarDateSelect = (date: Date) => {
    onDateSelect?.(date);
    onFiltersChange({ ...filters, dateRange: "all" });
    handleClose("date");
  };

  // Calendar grid for current view month
  const calendarDays = useMemo(() => {
    const { year, month } = calendarView;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const totalCells = startPad + daysInMonth;
    const rows = Math.ceil(totalCells / 7);
    const grid: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    const remainder = rows * 7 - grid.length;
    for (let i = 0; i < remainder; i++) grid.push(null);
    return grid;
  }, [calendarView]);

  const today = useMemo(() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
  }, []);

  const isPast = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < t.getTime();
  };


  return (
    <Box sx={{ mb: 2 }}>
      {/* Horizontal Scrollable Filters */}
      <Box sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 1,
        '::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        {/* Reset Button */}
        <Chip
          icon={<FilterListIcon />}
          label="Reset"
          onClick={onReset}
          variant="outlined"
          sx={{
            bgcolor: "background.paper",
            border: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            borderRadius: "20px",
            fontWeight: 500,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.08)" },
            "&:active": { transform: "scale(0.98)" },
          }}
        />

        {/* Date Filter — opens calendar popover */}
        <Chip
          icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          label={
            selectedDateValue
              ? formatDateLabel(selectedDateValue)
              : filters.dateRange === "all"
                ? "Date"
                : filters.dateRange === "today"
                  ? "Today"
                  : filters.dateRange === "tomorrow"
                    ? "Tomorrow"
                    : "This Week"
          }
          onClick={handleDateChipClick}
          color={filters.dateRange !== "all" || selectedDateValue ? "primary" : "default"}
          sx={{
            bgcolor: filters.dateRange !== "all" || selectedDateValue ? "#00E377" : "background.paper",
            color: filters.dateRange !== "all" || selectedDateValue ? "#191F28" : "text.primary",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            border: "none",
            borderRadius: "20px",
            fontWeight: 500,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            "&:hover": {
              boxShadow: filters.dateRange !== "all" || selectedDateValue ? "0 4px 12px rgba(0,227,119,0.35)" : "0 4px 10px rgba(0,0,0,0.08)",
            },
            "&:active": { transform: "scale(0.98)" },
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
        <Popover
          open={openDatePopover}
          anchorEl={anchorEl["date"]}
          onClose={() => handleClose("date")}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              borderRadius: 16,
              mt: 1.5,
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              overflow: "hidden",
              minWidth: 320,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Quick options */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
              {[
                { value: "all", label: "All Dates" },
                { value: "today", label: "Today" },
                { value: "tomorrow", label: "Tomorrow" },
                { value: "week", label: "This Week" },
              ].map((opt) => (
                <Chip
                  key={opt.value}
                  size="small"
                  label={opt.label}
                  onClick={() => handleSelect("dateRange", opt.value)}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 500,
                    bgcolor: filters.dateRange === opt.value && !selectedDateValue ? "primary.main" : "action.hover",
                    color: filters.dateRange === opt.value && !selectedDateValue ? "primary.contrastText" : "text.primary",
                    "&:hover": { bgcolor: filters.dateRange === opt.value && !selectedDateValue ? "primary.dark" : "action.selected" },
                  }}
                />
              ))}
            </Box>
            {/* Month navigation + calendar */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <IconButton
                size="small"
                onClick={() => setCalendarView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }))}
                sx={{ color: "text.secondary" }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="subtitle2" fontWeight={600}>
                {MONTH_NAMES[calendarView.month]} {calendarView.year}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setCalendarView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }))}
                sx={{ color: "text.secondary" }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, textAlign: "center" }}>
              {WEEKDAY_HEADERS.map((h) => (
                <Typography key={h} variant="caption" color="text.secondary" fontWeight={600} sx={{ py: 0.5 }}>
                  {h}
                </Typography>
              ))}
              {calendarDays.map((day, idx) => {
                if (day === null) return <Box key={`empty-${idx}`} />;
                const isPastDay = isPast(calendarView.year, calendarView.month, day);
                const isToday =
                  calendarView.year === today.y && calendarView.month === today.m && day === today.d;
                const isSelected =
                  selectedDateValue &&
                  calendarView.year === selectedDateValue.getFullYear() &&
                  calendarView.month === selectedDateValue.getMonth() &&
                  day === selectedDateValue.getDate();
                return (
                  <Box
                    key={`${calendarView.year}-${calendarView.month}-${day}`}
                    onClick={() => {
                      if (isPastDay) return;
                      handleCalendarDateSelect(new Date(calendarView.year, calendarView.month, day));
                    }}
                    sx={{
                      py: 0.75,
                      borderRadius: "10px",
                      cursor: isPastDay ? "not-allowed" : "pointer",
                      opacity: isPastDay ? 0.4 : 1,
                      bgcolor: isSelected ? "#00E377" : isToday ? "action.selected" : "transparent",
                      color: isSelected ? "#191F28" : isToday ? "primary.main" : "text.primary",
                      fontWeight: isToday || isSelected ? 700 : 500,
                      fontSize: "0.875rem",
                      "&:hover": isPastDay ? {} : { bgcolor: isSelected ? "#00C466" : "action.hover" },
                    }}
                  >
                    {day}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Popover>

        {/* Gender Filter */}
        <Chip
          icon={<WcIcon />}
          label={filters.gender === 'all' ? 'Gender' : filters.gender}
          onClick={(e) => handleClick('gender', e)}
          color={filters.gender !== 'all' ? "primary" : "default"}
          sx={{
            bgcolor: filters.gender !== 'all' ? 'primary.main' : 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: 'none',
            color: filters.gender !== 'all' ? 'white' : 'text.primary',
            '& .MuiChip-icon': { color: filters.gender !== 'all' ? 'white' : 'inherit' }
          }}
        />
        <Menu
          anchorEl={anchorEl['gender']}
          open={Boolean(anchorEl['gender'])}
          onClose={() => handleClose('gender')}
          PaperProps={{ sx: { borderRadius: '12px', mt: 1 } }}
        >
          <MenuItem onClick={() => handleSelect('gender', 'all')}>All Genders</MenuItem>
          <MenuItem onClick={() => handleSelect('gender', 'Men Only')}>Men Only</MenuItem>
          <MenuItem onClick={() => handleSelect('gender', 'Women Only')}>Women Only</MenuItem>
          <MenuItem onClick={() => handleSelect('gender', 'All Genders')}>Mixed</MenuItem>
        </Menu>

        {/* Level Filter — PLAB-style labels */}
        <Chip
          icon={<SchoolIcon />}
          label={filters.level === "all" ? "Level" : getSkillLevelLabel(filters.level)}
          onClick={(e) => handleClick("level", e)}
          color={filters.level !== "all" ? "primary" : "default"}
          sx={{
            bgcolor: filters.level !== "all" ? "primary.main" : "background.paper",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            border: "none",
            color: filters.level !== "all" ? "white" : "text.primary",
            "& .MuiChip-icon": { color: filters.level !== "all" ? "white" : "inherit" },
          }}
        />
        <Menu
          anchorEl={anchorEl["level"]}
          open={Boolean(anchorEl["level"])}
          onClose={() => handleClose("level")}
          PaperProps={{ sx: { borderRadius: "12px", mt: 1 } }}
        >
          <MenuItem onClick={() => handleSelect("level", "all")}>All Levels</MenuItem>
          <MenuItem onClick={() => handleSelect("level", "STARTER")}>{getSkillLevelLabel("STARTER")}</MenuItem>
          <MenuItem onClick={() => handleSelect("level", "ROOKIE")}>{getSkillLevelLabel("ROOKIE")}</MenuItem>
          <MenuItem onClick={() => handleSelect("level", "AMATEUR")}>{getSkillLevelLabel("AMATEUR")}</MenuItem>
          <MenuItem onClick={() => handleSelect("level", "SEMI_PRO")}>{getSkillLevelLabel("SEMI_PRO")}</MenuItem>
          <MenuItem onClick={() => handleSelect("level", "PRO")}>{getSkillLevelLabel("PRO")}</MenuItem>
          <MenuItem onClick={() => handleSelect("level", "ELITE")}>{getSkillLevelLabel("ELITE")}</MenuItem>
        </Menu>

        {/* Team Size Filter */}
        <Chip
          label={filters.teamSize === 'all' ? 'Size' : filters.teamSize}
          onClick={(e) => handleClick('teamSize', e)}
          color={filters.teamSize !== 'all' ? "primary" : "default"}
          sx={{
            bgcolor: filters.teamSize !== 'all' ? 'primary.main' : 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: 'none',
            color: filters.teamSize !== 'all' ? 'white' : 'text.primary',
          }}
        />
        <Menu
          anchorEl={anchorEl['teamSize']}
          open={Boolean(anchorEl['teamSize'])}
          onClose={() => handleClose('teamSize')}
          PaperProps={{ sx: { borderRadius: '12px', mt: 1 } }}
        >
          <MenuItem onClick={() => handleSelect('teamSize', 'all')}>All Sizes</MenuItem>
          <MenuItem onClick={() => handleSelect('teamSize', '5vs5')}>5vs5</MenuItem>
          <MenuItem onClick={() => handleSelect('teamSize', '6vs6')}>6vs6</MenuItem>
          <MenuItem onClick={() => handleSelect('teamSize', '7vs7')}>7vs7</MenuItem>
          <MenuItem onClick={() => handleSelect('teamSize', '8vs8')}>8vs8</MenuItem>
        </Menu>
        {/* Location Filter */}
        <Chip
          icon={<LocationOnIcon />}
          label={filters.location === 'all' ? 'Location' : filters.location}
          onClick={(e) => handleClick('location', e)}
          color={filters.location !== 'all' ? "primary" : "default"}
          sx={{
            bgcolor: filters.location !== 'all' ? 'primary.main' : 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: 'none',
            color: filters.location !== 'all' ? 'white' : 'text.primary',
            '& .MuiChip-icon': { color: filters.location !== 'all' ? 'white' : 'inherit' }
          }}
        />
        <Menu
          anchorEl={anchorEl['location']}
          open={Boolean(anchorEl['location'])}
          onClose={() => handleClose('location')}
          PaperProps={{ sx: { borderRadius: '12px', mt: 1 } }}
        >
          <MenuItem onClick={() => handleSelect('location', 'all')}>All Locations</MenuItem>
          <MenuItem onClick={() => handleSelect('location', 'Seoul')}>Seoul</MenuItem>
          <MenuItem onClick={() => handleSelect('location', 'Busan')}>Busan</MenuItem>
          <MenuItem onClick={() => handleSelect('location', 'Incheon')}>Incheon</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export { defaultFilters };

