# Chapter 1: Introduction

## 1.1 Introduction and Background

Public and institutional transportation systems—particularly university shuttle networks—play an essential role in daily student and staff mobility. Every academic day, thousands of commuters rely on university buses to travel between city transit hubs, residential areas, and university campuses. Managing such fleets requires continuous coordination across multiple moving parts: vehicles, drivers, daily attendance, multi-stop routes, recurring semester timetables, and real-time dispatch monitoring.

Traditionally, small-to-medium university and institutional fleets have been managed using static paper timetables, manual attendance logs, spreadsheets, or informal messaging channels between dispatchers and drivers. While these manual workflows may function at a very small scale, they fail to provide operational visibility once vehicles leave the terminal. Dispatchers cannot easily verify where a bus is located, whether a trip started on schedule, or how stops are sequenced spatially along a route. Similarly, drivers lack a unified digital interface that combines their daily bus assignment, scheduled trips, ordered stop points, and live route navigation.

Advancements in modern web technologies—specifically real-time bidirectional communication protocols such as WebSockets (ASP.NET Core SignalR), browser-based Geolocation APIs, interactive vector mapping engines (MapLibre GL), and Clean Architecture backend design—make it possible to replace dedicated, expensive hardware GPS trackers and fragmented spreadsheets with an accessible, browser-based Fleet Management System.

**BusManager** is a full-stack, real-time University Bus Fleet Management and Tracking System designed to modernize institutional transit operations. Built using ASP.NET Core Web API following Clean Architecture principles on the backend and React with MapLibre GL on the frontend, BusManager provides administrators and drivers with a centralized, bilingual (Arabic and English) platform for fleet administration, route geospatial planning, automated calendar-based trip scheduling, daily driver-bus attendance tracking, and live real-time vehicle telemetry.

---

## 1.2 Problem Statement

University and institutional bus fleet operations suffer from several persistent operational and technical challenges when managed without an integrated digital platform:

1. **Lack of Real-Time Fleet Visibility**: Once a bus departs on a trip, administrators have no live view of its geographic position without calling the driver directly, creating safety hazards and communication delays.
2. **Manual and Repetitive Trip Scheduling**: Transit schedules follow recurring weekly patterns (e.g., Sunday–Thursday academic schedules), yet administrators often have to re-enter daily trips and driver-bus assignments manually, leading to human error and administrative overhead.
3. **Disconnected Driver Attendance and Vehicle Dispatch**: Tracking which driver is operating which bus on a given day is frequently separated from trip scheduling, resulting in conflicting assignments, unassigned trips, or inaccurate attendance records.
4. **Error-Prone Geospatial Stop Management**: Recording bus stop locations manually via raw latitude and longitude coordinates or text descriptions leads to inaccurate stop placements and makes it difficult to visualize the exact sequence of pickup and drop-off points along a route.
5. **Absence of Live Route Guidance for Drivers**: Drivers assigned to different routes or shifts often lack a clear, interactive view of their active trip's route geometry, ordered stop sequence, and nearest upcoming stop.
6. **High Cost of Proprietary Hardware Solutions**: Commercial fleet telematics systems typically require dedicated onboard GPS hardware units and recurring per-vehicle subscription fees, making them cost-prohibitive for universities and local institutions when drivers already carry GPS-enabled smartphones or tablets.

---

## 1.3 Project Objectives

The primary goal of **BusManager** is to design and implement a scalable, secure, and user-friendly web application that streamlines daily bus fleet management and real-time tracking. Specifically, the project aims to achieve the following objectives:

1. **Centralize Fleet & Personnel Administration**: Provide administrators with full CRUD management over buses, drivers, stop points, routes, and ordered route-stop sequences through a clean, responsive dashboard.
2. **Enable Interactive Geospatial Planning**: Replace manual coordinate entry with interactive map-based stop picking and visual route-path rendering (using MapLibre GL and street-level OSRM routing) so administrators and drivers can visualize routes and ordered stops clearly.
3. **Automate Recurring Schedules via Service Calendars**: Implement a GTFS-inspired `ServiceCalendar` and `CalendarTripTemplate` engine capable of validating operating days of the week and automatically generating daily trips and driver-bus assignments.
4. **Digitize Daily Driver Attendance & Bus Assignment**: Record daily check-ins by pairing active buses with drivers (`BusDriver` assignments) and linking daily scheduled trips directly to verified assignments.
5. **Deliver Real-Time Bus Tracking Without Dedicated Hardware**: Utilize browser Geolocation APIs on the driver's device and ASP.NET Core SignalR WebSockets to stream live bus coordinates directly to the administrator's live fleet map with low latency.
6. **Empower Drivers with an Operational Cockpit**: Provide drivers with a dedicated mobile-friendly interface displaying their daily assigned bus, scheduled trips, one-tap trip start/end lifecycle controls (`Scheduled` → `In Progress` → `Completed`), and a live navigation map highlighting their route and nearest stop.
7. **Ensure Enterprise-Grade Security & Maintainability**: Enforce Role-Based Access Control (RBAC) using JWT access tokens, BCrypt-hashed rotating refresh tokens, and API rate limiting within a decoupled Clean Architecture (`Domain`, `Application`, `Infrastructure`, and `API` layers) supporting both Arabic (RTL) and English (LTR) interfaces.

---

## 1.4 Project Scope

The scope of the **BusManager** graduation project encompasses the design, development, and integration of both the backend server infrastructure and the responsive web frontend across two primary operational roles:

### In-Scope Features
* **Authentication & Authorization Module**:
  * Secure login, JWT token issuance, automatic silent refresh-token rotation, logout revocation, and login rate limiting.
  * Role-based route and endpoint protection separating **Administrator** and **Driver** capabilities.
* **Administrator Control Panel**:
  * **Live Fleet Map**: Real-time visualization of active buses via SignalR alongside color-coded pickup and drop-off stop points.
  * **Geospatial Stop & Route Management**: Interactive map pin selection for creating/editing stop points, route creation, and ordered `RouteStop` sequencing with estimated travel minutes from origin and full route-map popup previews.
  * **Attendance & Bus Assignment Module**: Daily assignment of available buses to drivers, attendance statistics, and historical date filtering.
  * **Trip Lifecycle & Service Calendar Engine**: Manual trip scheduling as well as recurring `ServiceCalendar` and `CalendarTripTemplate` definitions for automated daily trip generation.
* **Driver Operational Portal**:
  * Automatic detection of the driver's daily assigned bus.
  * Background real-time GPS coordinate transmission over SignalR WebSockets while on duty.
  * Trip execution controls (`Start Trip` and `End Trip`) recording actual departure and arrival timestamps (`ActualStartTime`, `ActualArrivalTime`).
  * Live active-trip route map displaying street-level route paths, numbered stop sequences, and real-time nearest-stop detection.
* **Bilingual Localization**:
  * Complete Arabic (`RTL`) and English (`LTR`) user interface support with instant language switching.

### Out-of-Scope Features
* **Separate Mobile Apps**: The system is built as a responsive web application that works on phone and desktop browsers, rather than separate downloadable iOS or Android apps.
* **Online Payments and Ticketing**: Buying tickets or paying bus fares online is not included, since university buses are provided directly for students and staff.
* **Bus Engine and Fuel Sensors**: Tracking fuel consumption, engine health, or mechanical maintenance using physical sensors inside the bus is outside the scope of this project.

---

## 1.5 Project Limitations

Despite fulfilling its core functional and architectural objectives, the system operates within certain technical and environmental constraints:

1. **Dependence on Client Device GPS Hardware**: Because live tracking relies on the W3C Browser Geolocation API rather than dedicated external satellite antennas, location accuracy depends on the driver's device. Smartphones with built-in GPS chips provide high accuracy (3–10 meters), whereas desktop or laptop browsers without GPS hardware rely on Wi-Fi/IP triangulation and yield coarser positioning.
2. **Continuous Network Connectivity Requirement**: Real-time location streaming via SignalR and map tile loading require an active mobile data or Wi-Fi connection; locations captured in cellular dead zones are not buffered offline for delayed replay.
3. **Foreground Browser Execution Constraints**: Mobile web browsers throttle or suspend JavaScript geolocation watchers when the browser screen is locked or minimized to the background, requiring the Driver Portal to remain open on the device during active trips.
4. **Third-Party Map Tile & Routing Availability**: Visual basemap tiles (CartoDB Voyager) and street-level polyline snapping (public OSRM routing API) depend on external public services, although the system automatically degrades gracefully to straight-line stop-to-stop geometry if the routing service is unreachable.

---

## 1.6 Report Organization

The remainder of this graduation project report is organized into four chapters followed by the list of references:

* **Chapter 2: Literature Review** — Discusses the theoretical background, reviews existing bus tracking applications and related research studies, compares current solutions, and identifies the research gap addressed by this project.
* **Chapter 3: Methodology and System Analysis** — Explains the proposed approach and software development methodology, defines the functional and non-functional requirements, presents system modeling (Use Case Diagrams, Use Case Descriptions, and Activity Diagrams), and outlines the tools, technologies, and project timeline.
* **Chapter 4: System Design and Implementation** — Describes the overall Clean Architecture, detailed system modules, database schema, class and sequence diagrams, user interface design, development environment, implementation of core backend and frontend modules, and screenshots of the completed system.
* **Chapter 5: Testing, Results, and Conclusion** — Evaluates the developed system through a structured testing strategy, test cases, and results discussion, and concludes the report by summarizing key challenges, project outcomes, and future work.
* **References** — Lists all academic papers, books, documentation, and technical resources cited throughout the report.
