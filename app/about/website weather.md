**Smart** **Solar-Powered** **IoT** **Weather** **Station** **–**
**Executive** **Summary**

This project delivers a **self-contained,** **solar-powered** **IoT**
**weather** **station** that continuously measures temperature,
humidity, pressure, UV intensity, wind speed/direction, and rainfall. It
uses an **ESP32** **microcontroller** to gather data from multiple
sensors, transmits readings wirelessly to a gateway via **ESP-NOW**, and
logs them in the cloud for real-time visualization and analysis. The
system is built for low-power, reliable operation: a **5** **V**
**solar** **panel** charges a single 18650 Li-ion battery through a
TP4056 charger, and a boost converter (MT3608) generates regulated 5 V
and 3.3 V rails. A **single-board** **PCB** (designed in KiCad) holds
most components, while custom 3D-printed parts mount the sensors and
electronics.

The project was conceived as a scalable platform for local climate
monitoring – useful in **smart** **agriculture,** **distributed**
**meteorological** **sensing,** **and** **environmental** **IoT**
**applications**. It demonstrates tight integration of hardware and
software: sensor interfacing with proper level-shifting, solar power
management, embedded firmware, wireless communication, a Node.js
backend, and a PostgreSQL (Supabase) cloud database. The report below
walks through the system design, wiring, and implementation in detail,
citing official datasheets and standards wherever possible.

**Project** **Overview** **and** **Goals**

The **Smart** **Solar-Powered** **IoT** **Weather** **Station** is a
standalone system designed to **monitor** **and** **log** **local**
**weather** **conditions** **with** **minimal** **human**
**intervention**. As a fully autonomous sensor network node, its goals
include:

> • **Autonomous** **Operation:** Powered by a solar panel and
> rechargeable 18650 battery, the station must run continuously with no
> external power.
>
> • **Full** **Environment** **Sensing:** It measures ambient
> temperature, humidity, barometric pressure, UV index, wind
> speed/direction, and rainfall.
>
> • **Low** **Power** **&** **Reliability:** Using efficient components
> (ESP32 microcontroller, Hall-effect sensors, I²C digital sensors) and
> low-latency ESP-NOW wireless comms, it minimizes power draw.
>
> • **Real-Time** **IoT** **Connectivity:** Data is sent over ESP-NOW to
> an indoor gateway (no Wi-Fi router needed) and then uploaded via HTTPS
> to a Supabase (PostgreSQL) backend, enabling dashboards and alerts.
>
> • **Modularity** **and** **Education:** The design is modular
> (breadboard or screw-terminals, with 3D-printed mounts) so students
> and hobbyists can adapt it or add sensors.

**Use-Cases:** Such a station can be used in **smart** **farming**
**and** **precision** **agriculture** – local weather data (temperature,
humidity, rainfall) helps optimize irrigation and
planting【41†L76-L80】. It is also valuable for community science (home
weather networks), industrial monitoring (e.g. remote pump stations), or
anywhere low-cost climate logging is needed.

**Hardware** **Components** **and** **Pin** **Connections**

The hardware system splits into an **Outdoor** **Sensor** **Node**
(solar-powered) and an **Indoor** **Gateway**. Below are key components:

||
||
||
||
||
||
||
||
||

||
||
||
||
||
||
||
||
||
||
||
||

**Pin-Level** **Wiring:** Sensors are connected to the ESP32 as follows
(see **Wiring** **Guide** below for details):

> • **I²C** **Sensors:** AHT20 and BMP280 share the I²C bus. Wire both
> VIN/VCC to 3.3 V rail, GND to ground. SDA → ESP32 GPIO21; SCL → GPIO22
> (standard I²C pins on many ESP32 boards).
>
> • **UV** **Sensor** **(GY-ML8511):** VIN and EN (enable) to 3.3 V (EN
> must be held high to activate【40†L1-L4】). OUT → ESP32 ADC pin GPIO32
> for analog reading.
>
> • **Hall-Effect** **Sensors** **(A3144):** Each sensor’s VCC (pin1) →
> 5.0 V rail, GND (pin2) → GND rail. Place a 10 kΩ resistor between each
> sensor’s VCC (pin1) and OUT (pin3) to pull the output
> high【2†L136-L139】. The OUT pin (open-collector) goes into the
> *high-voltage* *(5V* *side)* of a logic-level shifter; the
> corresponding low-voltage side goes to an ESP32 GPIO. Specifically:
>
> o Wind Vane North → Shifter1 HV1 → Shifter1 LV1 → GPIO25 o Wind Vane
> East → Shifter1 HV2 → LV2 → GPIO26
>
> o Wind Vane South → Shifter1 HV3 → LV3 → GPIO27 o Wind Vane West →
> Shifter1 HV4 → LV4 → GPIO14
>
> o Anemometer (Speed) → Shifter2 HV1 → LV1 → GPIO34 o Rain Gauge →
> Shifter2 HV2 → LV2 → GPIO35

These mappings ensure 5V signals from the sensors are safely read by the
3.3V ESP32 pins via the level shifter.

**Software** **Architecture**

The firmware on the **Outdoor** **ESP32** **Node** reads all sensors at
a fixed interval (e.g. every few seconds) and packages the data into a
structured payload. It uses the **ESP-NOW** **protocol** (a proprietary
2.4 GHz link provided by the ESP32’s Wi-Fi radio) to broadcast the data
to the **Indoor** **Gateway** **ESP32**【11†L282-L288】. ESP-NOW was
chosen because it is very low-latency, peer-to-peer (no router needed),
and incurs minimal overhead【11†L282-L288】. The node then goes into a
light-sleep mode between measurements to save power.

The **Indoor** **Gateway** **ESP32** acts as a repeater/display and
internet bridge. It runs its own firmware to receive incoming ESP-NOW
packets from the outdoor node (on a registered MAC address), parse the
sensor values, and do three things: (1) update the local TFT display
with the latest readings, (2) generate a QR code / user interface if
needed, and (3) **push** **the** **data** **to** **the** **cloud**. To
send to the cloud, the gateway connects to local Wi-Fi and makes an
HTTP(S) request to a Node.js backend server.

On the cloud side, a **Node.js** (Express) service provides an API
endpoint for incoming data. This service inserts each new reading into a
**Supabase** (PostgreSQL) database table. Supabase is an open-source
Firebase alternative built on PostgreSQL; it instantly provides REST
endpoints for tables and a real-time streaming API【16†L79-L88】. In our
setup, each row in the sensor_datatable contains timestamp, temperature,
humidity, pressure, UV level, wind speed/direction, and rain count.

Because every table in Supabase automatically has a RESTful endpoint,
the Node.js code is minimal – it simply forwards authenticated POST
requests into the database 【16†L79-L88】【16†L104-L110】.

The end result: data from the outdoor station flows (Node → Gateway →
Node.js → Supabase) into a centralized database, where web dashboards or
alerting systems can subscribe via Supabase’s real-time
API【16†L79-L88】. For example, a dashboard page could listen for new
rows in the table and update graphs live.

**Power** **System** **and** **Charging** **Circuit**

The power subsystem ensures the station runs continuously from sunlight.
It has three stages (see Wiring Guide diagram):

> 1\. **Solar** **Panel** **→** **Battery** **Charger** **(TP4056):**
> The panel (rated ~5 V) connects to IN+ and IN– on the TP4056 Li-ion
> charger board. The TP4056 handles MPPT-less charging of the single
> 18650 cell. The battery holder (+) goes to TP4056 B+ and (–) to B–.
> When sun is available, the panel trickle-charges the battery up to 4.2
> V.
>
> 2\. **Battery** **→** **Boost** **Converter** **(MT3608):** The 18650
> battery (~3.7 V nominal) powers an MT3608 adjustable boost converter.
> The battery (+) goes to MT3608 VIN+ and (–) to VIN–. On the MT3608
> output side, attach a multimeter to VOUT+ and VOUT– **before**
> powering any electronics. Adjust the little brass trim potentiometer
> until it reads exactly **5.0** **V**【6†L68-L76】. This 5.0 V output
> will drive the ESP32 VIN pin and power the 5 V rail for sensors.
>
> 3\. **Power** **Rails** **Distribution:** On the main protoboard or
> terminal block, distribute rails:
>
> a\. **5V** **Rail** **(Red):** MT3608 VOUT+ → red rail. Connect
> ESP32’s VIN (5V) pin here, and all 5V-needed components (Hall sensor
> Vcc, Logic shifter HV pins).
>
> b\. **Ground** **Rail** **(Black/Blue):** MT3608 VOUT– → ground rail.
> Connect ESP32 GND, all sensor GNDs, battery –, etc., here.
>
> c\. **3.3V** **Rail** **(Separate** **Red):** Use the ESP32’s internal
> 3.3 V regulator (ESP32 pin “3V3”) to feed a 3.3 V rail for the digital
> sensors (AHT20, BMP280, UV sensor Vcc/En, and level shifter LV pins).
> *Do* *not* connect 3.3 V rail to 5 V rail directly.

Because the boost converter is set to 5.0 V, the ESP32 VIN pin sees
exactly 5 V input (which its onboard regulator uses to generate 3.3 V).
Note that the TP4056 battery output (~4.2–3.7 V) is connected only to
the MT3608 VIN, not directly to the ESP32. Always re-check polarity and
verify each voltage with a meter before plugging in the ESP32 or
sensors.

**PCB** **and** **Mechanical** **Notes**

Most electronics (ESP32, charger, booster, level shifters) can live on a
**single** **protoboard** **or** **small** **custom** **PCB**. In
practice, many prototypers used a solderless breadboard or
screw-terminal board for flexibility. Critical wiring (power and sensor
lines) should be soldered or securely connected to avoid loose contacts
outdoors.

> • **3D-Printed** **Enclosure:** A simple weatherproof box was
> 3D-printed (blue colored) to hold the TP4056, battery holder, and
> level shifters. The solar panel mounts on top. Another enclosure
> houses the ESP32 and TFT display indoors. Drilled openings allow
> cables to pass (with silicone sealant for rain).
>
> • **Sensor** **Mounts:** The wind vane (with four magnets at N/E/S/W)
> and anemometer require supports. A common DIY approach is a vertical
> shaft with horizontal tail (for vane) and a small windmill rotor (for
> speed). Hall sensors are placed at known fixed positions so that the
> rotating magnets pass over them. The rain gauge is typically a tipping
> bucket with a small magnet under one bucket that closes the A3144 when
> a tip occurs.
>
> • **Stevenson** **Screen:** Ideally, the temperature/humidity sensors
> should be inside a radiation shield (Stevenson screen) to prevent
> direct sun heating【 41†L76-L80】. In a simple build, a white plastic
> louvered box around those sensors will suffice.

Because the exact PCB footprint and 3D parts weren’t fully specified,
builders may vary. The key is to keep the PCBs dry and mount the
components as rigidly as possible. Leave test points for measuring the
MT3608 output and battery voltage.

**Sensor** **Interfacing** **and** **Level** **Shifting**

**Digital** **Sensors** **(I²C)**

> •     **AHT20** **(Temp/Humidity):** This sensor uses a single I²C
> address. It accepts 2.2–5.5 V on VDD【36†L7-L10】 (we power it at 3.3
> V). Connect a **10** **μF**
>
> **decoupling** **capacitor** across VDD–GND as close to the chip as
> possible【 36†L7-L10】. The SDA and SCL lines both need pull-up
> resistors to 3.3 V (often on-board modules have 10 kΩ). On our ESP32,
> SDA → GPIO21, SCL → GPIO22.
>
> • **BMP280** **(Pressure):** Another I²C sensor (default address 0x76
> or 0x77). It runs at 3.3 V. Similar to AHT20, use 10 μF decoupling.
> Wire SDA → GPIO21 and SCL → GPIO22 (same bus as AHT20).
>
> o *(Accuracy* *note:* *The* *BMP280* *is* *a* *high-precision*
> *barometer,* *typically* *±1.0* *hPa* *accuracy).*

**Analog** **Sensor**

> • **GY-ML8511** **(UV** **Intensity):** This breakout contains a UV
> photodiode and op-amp, outputting a voltage proportional to UV (with
> roughly 0–1 V output per 10 mW/cm² of UVA【39†L1-L4】). It has a
> separate **EN** (enable) pin that must be driven high to run (tie EN
> to 3.3 V【40†L1-L4】). So power it from the 3.3 V rail: VIN = 3.3 V,
> EN = 3.3 V. Its ground goes to GND. The OUT pin is analog; connect OUT
> → ESP32 ADC input GPIO32. Use a **0.1** **μF** **decoupling**
> **capacitor** on its VDD (per datasheet) and 10 μF if stable readings
> are needed【8†L29-L33】【36†L7-L10】.

**Hall-Effect** **Sensors** **(Wind/Rain)**

> • **A3144** **Hall** **Sensors:** These are unipolar digital switches
> (open-collector) rated 4.5–24 V operation (we use 5 V)【2†L136-L139】.
> Each sensor has three pins: VCC, GND, OUT. Connect all VCC pins to the
> 5 V rail, all GND pins to ground. **Crucially,** **solder** **a**
> **10** **kΩ** **resistor** **between** **each** **sensor’s** **VCC**
> **and** **OUT**【2†L136-L139】 so that in the absence of a magnet, the
> output reads HIGH. Without this pull-up, the output floats and yields
> noisy data【2†L136-L139】. In addition, we add a 0.01–0.1 μF cap
> between VCC and GND for each sensor to smooth transients (a good
> practice for Hall sensors).
>
> • The OUT pin of each A3144 goes to the *high-voltage* *side* of a
> level shifter. For example, Wind-Vane North: A3144.OUT →
> LevelShifter1.HV1, then LevelShifter1.LV1 → ESP32.GPIO25. This ensures
> the 5 V pulses from the sensor are reduced to safe 3.3 V logic for the
> ESP32.

The rationale for level shifting: The ESP32’s GPIOs are not 5 V
tolerant. Our Hall sensors run at 5 V for compatibility with the battery
and to produce clear digital signals. The two 4-channel shifter boards
(commonly using MOSFETs or BSS138

transistors) translate each HV pin to a corresponding LV pin. We power
the shifter boards themselves with HV=5 V and LV=3.3 V. Note that the
I²C bus does *not* go through these shifters; those sensors already run
at 3.3 V and are connected directly.

**Wiring** **Guide** **(Step-by-Step)**

The wiring proceeds in phases (as in the included Wiring Guide):

> 1\. **Assemble** **Power** **Subsystem** **(Solar→Charger→Boost):**
>
> a\. Attach solar panel red (+) to TP4056 IN+, black (–) to IN–. b.
> Attach battery holder red (+) to TP4056 B+, black (–) to B–.
>
> c\. Connect TP4056 OUT+ to MT3608 VIN+, and TP4056 OUT– to VIN–. d. Do
> **NOT** connect the ESP32 or sensors yet. First tune the MT3608:
>
> connect a meter to MT3608 VOUT+ and VOUT–, turn its potentiometer
> until 5.00 V appears. Lock it there.
>
> **2.** **Build** **Power** **Rails:**
>
> a\. Wire MT3608 VOUT+ to the **5V** **rail** (red) on your board. Wire
> MT3608 VOUT– to **GND** **rail** (black).
>
> b\. On the 5V rail, connect ESP32 VIN (which powers the board) and the
> HV side of all level shifters.
>
> c\. On the GND rail, connect ESP32 GND, all sensor grounds, and both
> sides of shifter grounds.
>
> d\. Connect the ESP32’s **3.3V** **pin** to a separate **3.3V**
> **rail** (second red rail). Power the 3.3V sensors and the LV side of
> the shifters from this 3.3V rail.
>
> **3.** **Wire** **Shifters** **(Bodyguards):**
>
> a\. On **both** level-shifter boards: HV pin → 5V rail, LV pin → 3.3V
> rail, GND (both sides) → GND rail. This powers the translators.
>
> **4.** **Attach** **I²C** **Sensors** **(3.3V):**
>
> a\. AHT20 and BMP280 VIN/VCC → 3.3V rail; GND → ground.
>
> b\. SDA (both) → ESP32 GPIO21 (connect both SDA wires to same pin if
> needed, or use a bus connector).
>
> c\. SCL (both) → ESP32 GPIO22. **5.** **Attach** **UV** **Sensor:**
>
> a\. VIN and EN → 3.3V rail; GND → ground. b. OUT → ESP32 GPIO32 (ADC).
>
> **6.** **Prepare** **Hall** **Sensors:**
>
> a\. Solder each 10 kΩ resistor between VCC and OUT on each A3144
> sensor. This pull-up is **mandatory**【2†L136-L139】.
>
> b\. Connect all A3144 VCC pins to the 5V rail; all GND pins to ground.
>
> c\. Connect A3144.OUT pins to the shifters as per the mapping (see
> table above). For example, North: OUT → Shifter1 HV1; East: OUT →
> Shifter1 HV2; etc.
>
> 7\. **Final** **Check:**
>
> a\. Verify all connections. Ensure resistors are in place. Check there
> are no shorts. Power up first without the ESP32: measure 5.0 V and 3.3
> V rails under no load. Then connect the ESP32 and test that it boots
> correctly (e.g. blink LED).

Throughout wiring, keep power off while connecting. Only turn on after
each major phase is complete.

**Software** **Logic**

> • **ESP32** **Outdoor** **Node** **Firmware:** In setup(), initialize
> I²C bus and ESP-NOW. Calibrate any sensors (e.g. read baseline). In
> the loop, read sensors: issue I²C commands to AHT20/BMP280, read
> analog voltage from UV sensor, read digital states of Hall sensors
> (measure anemometer pulses, determine wind direction from magnets,
> count rain bucket tips). Package data (with timestamp) into a
> struct/bytes. Transmit via esp_now_send()to the gateway’s MAC. Then
> esp_sleep()for a configured interval (e.g. 10 s).
>
> • **ESP32** **Gateway** **Firmware:** On boot, connect to home Wi-Fi.
> Initialize TFT display and ESP-NOW as receiver. When an ESP-NOW packet
> arrives (callback), parse it into readings. Update the TFT display
> with latest values (and generate a QR code if desired). Use HTTP
> client to POST the data to the Node.js server’s REST API (HTTPS
> recommended for security). Optionally write to SD card or local flash
> for backup.
>
> • **Node.js** **Backend:** Exposes a POST /addReadingendpoint
> (protected by an API key). On receiving data, it writes a new row into
> Supabase’s sensor_data table (using the Supabase client or direct
> SQL). It may also broadcast the new data to any connected web clients
> via Supabase’s Realtime features.
>
> • **Supabase** **Database:** Has (at minimum) one table
> sensor_datawith columns: id (PK), device_id (FK), timestamp,
> temperature, humidity, pressure,
>
> uv_index, wind_speed, wind_direction, rainfall. The gateway’s data
> ends up here. Clients/dashboards can query or subscribe to this table.

Mermaid flowchart (system diagram):

> flowchart LR A\[Outdoor Node\<br\>(ESP32 + Sensors)\] --\>\|ESP-NOW
> wireless\|
>
> B\[Gateway Node\<br\>(ESP32 + TFT)\] B --\>\|Wi-Fi + HTTPS\|
> C\[Node.js API Server\]
>
> C --\> D\[Supabase PostgreSQL DB\] C --\> E\[TFT Display on Gateway\]
> subgraph Cloud
>
> C & D end
>
> note right of D: Tables: sensor_data, etc.

The table below shows how each sensor line connects to the ESP32
(assuming GPIO numbering as labeled on the DevKit board):

||
||
||
||
||
||
||
||
||

||
||
||
||
||
||
||
||
||
||

*Table:* *Signal* *routing* *and* *GPIO* *assignments* *for* *outdoor*
*node.* Ensure the level shifters route each HV line (5V) to the listed
LV GPIO. All sensors share the common 3.3 V and ground rails.

**Safety** **and** **Testing** **Checklist**

Before powering up the full system, check each part:

> • **Electrical** **Safety:** Verify battery polarity. Ensure no
> exposed wires shorting. Confirm voltage rails: with multimeter, check
> the 5V rail is exactly 5.0 V (tuned) and 3.3 V rail is stable.
>
> • **Component** **Ratings:** The A3144 outputs require 10 kΩ pull-ups
> to 5 V【 2†L136-L139】; confirm they are soldered. The UV sensor’s EN
> pin should be tied high to avoid inadvertent shutdown【40†L1-L4】.
>
> • **Sensor** **Function:** Power on and read each sensor individually
> if possible. For example, run a simple I²C scan to see AHT20/BMP280
> respond (Adafruit example code). Check UV sensor by shining a UV lamp
> or sunlight and reading ADC. For each Hall sensor, move a magnet
> nearby and observe the corresponding ESP32 GPIO toggling (use a debug
> LED or serial print).
>
> • **Software** **Sanity:** Check the gateway’s display code by
> inputting fake data if necessary. Ensure the Node.js endpoint accepts
> a test POST (use curl or Postman) before relying on the ESP32.
>
> • **Environmental** **Protection:** Make sure the outdoor electronics
> are sheltered (use a waterproof box or conformal coating). The solar
> panel should be firmly mounted and angled. All cables through
> enclosures must be sealed or use waterproof glands.

**Deployment** **and** **Maintenance** **Tips**

> • **Orientation:** Mount the anemometer where wind flows unobstructed
> (clear of fences or roofs). Calibrate the wind direction: align the
> magnets/sensors with true N/S/E/W if possible.
>
> • **Panel** **Maintenance:** Keep the solar panel clean. In full sun,
> it should readily recharge the 18650 daily if load is light.
>
> • **Firmware** **Updates:** With two ESP32s, you can update the
> outdoor node over serial or OTA (if Wi-Fi is later enabled). The
> gateway code should periodically send heartbeats or logs to the
> Node.js server for monitoring.
>
> • **Monitoring:** Use Supabase’s dashboard or Grafana (via Postgres
> data source) for visualization. Set alerts (e.g., low battery voltage,
> sensor out-of-range) using Supabase edge functions or third-party
> tools.
>
> • **Physical** **Checks:** Every few months, inspect solder joints and
> connectors for corrosion. Check battery health (replace after ~2 years
> if it no longer holds 2.9–4.2 V). Verify that pull-ups and decoupling
> caps remain in place.

**Suggested** **Improvements**

> • **Deep** **Sleep** **on** **Outdoor** **Node:** To further extend
> battery life, put the ESP32 in deep sleep between transmissions (wake
> on timer or interrupt from rain bucket magnet).
>
> • **More** **Sensors:** Add light (e.g. BH1750 or LDR) or CO₂ sensor.
> The modular PCB/shields can accommodate extras via I²C or analog.
>
> • **Calibration:** Implement software calibration: e.g. allow
> recalibration of BMP280 (pressure offset) or AHT20 (humidity offset)
> via EEPROM settings.
>
> • **Mesh** **Networking:** For multiple stations, use ESP-NOW’s
> broadcasting or switch to LoRaWAN for long-range links.
>
> • **Enclosure** **Upgrades:** Fabricate a proper Stevenson screen
> (ventilated white box) for accurate air temperature. Use UV-resistant
> enclosures.
