# Requirements Document

## Introduction

This document specifies requirements for expanding the anomaly detection game with 30+ unique anomaly types, enhanced room environments, and new room locations while maintaining architectural standards and test coverage.

## Glossary

- **Anomaly_System**: The subsystem responsible for generating, applying, and resolving anomalies
- **Room_Manager**: The subsystem responsible for creating and managing room environments
- **Anomaly**: A detectable change in the game environment (visual, audio, or behavioral)
- **Room**: A 3D environment containing furniture, lighting, and interactive objects
- **Anomaly_Type**: A classification of anomaly behavior (e.g., displaced, extra, autonomous)
- **Detection_Rate**: The percentage of triggered anomalies successfully resolved by the player
- **Spawn_Rate**: The time interval between anomaly generation events
- **Test_Coverage**: The percentage of code lines executed by automated tests
- **File_Size_Limit**: Maximum 200 lines per source file
- **Furniture_Object**: A 3D mesh representing a physical item in a room
- **Autonomous_Anomaly**: An anomaly that exhibits continuous movement or behavior changes
- **Environmental_Anomaly**: An anomaly affecting room-wide properties (lighting, temperature effects)
- **Object_Anomaly**: An anomaly affecting individual furniture objects

## Requirements

### Requirement 1: Expand Anomaly Type Library

**User Story:** As a player, I want to encounter 30+ unique anomaly types, so that gameplay remains unpredictable and engaging.

#### Acceptance Criteria

1. THE Anomaly_System SHALL support at least 30 distinct Anomaly_Types
2. WHEN an Anomaly is triggered, THE Anomaly_System SHALL select from all applicable Anomaly_Types for the target Room
3. THE Anomaly_System SHALL categorize Anomaly_Types into Object_Anomaly, Environmental_Anomaly, and Autonomous_Anomaly classifications
4. FOR ALL Anomaly_Types, THE Anomaly_System SHALL provide unique visual or behavioral characteristics
5. WHEN an Autonomous_Anomaly is active, THE Anomaly_System SHALL update its state on each render frame
6. THE Anomaly_System SHALL ensure each Anomaly_Type is testable through automated tests

### Requirement 2: Implement Object-Based Anomalies

**User Story:** As a player, I want to see furniture behaving strangely, so that I can identify subtle environmental changes.

#### Acceptance Criteria

1. WHEN a chair is selected as an anomaly target, THE Anomaly_System SHALL support "chair_floor" (chair lying on floor) transformation
2. WHEN a clock is present in a Room, THE Anomaly_System SHALL support "clock_backwards" (hands rotating counterclockwise) anomaly
3. WHEN books are present in a Room, THE Anomaly_System SHALL support "books_floating" (books hovering above surface) anomaly
4. WHEN a lamp is present in a Room, THE Anomaly_System SHALL support "lamp_flickering" (rapid on/off cycling) anomaly
5. WHEN cushions are present in a Room, THE Anomaly_System SHALL support "cushion_displaced" (cushions on floor) anomaly
6. WHEN a door is present in a Room, THE Anomaly_System SHALL support "door_ajar" (door partially open) anomaly
7. WHEN curtains are present in a Room, THE Anomaly_System SHALL support "curtains_moving" (curtains swaying without wind) anomaly
8. WHEN a mirror is present in a Room, THE Anomaly_System SHALL support "mirror_reflection" (wrong reflection color) anomaly

### Requirement 3: Implement Autonomous Anomalies

**User Story:** As a player, I want to see objects moving on their own, so that I experience unsettling supernatural events.

#### Acceptance Criteria

1. WHEN a "rocking_chair" anomaly is triggered, THE Anomaly_System SHALL animate the chair rocking back and forth continuously
2. WHEN a "spinning_fan" anomaly is triggered, THE Anomaly_System SHALL animate a ceiling fan rotating at abnormal speed
3. WHEN a "dripping_faucet" anomaly is triggered, THE Anomaly_System SHALL create periodic water drop visual effects
4. WHEN a "swinging_light" anomaly is triggered, THE Anomaly_System SHALL animate a hanging light swinging in a pendulum motion
5. WHEN a "crawling_shadow" anomaly is triggered, THE Anomaly_System SHALL animate a shadow moving across walls
6. FOR ALL Autonomous_Anomalies, THE Anomaly_System SHALL maintain animation state between render frames

### Requirement 4: Implement Environmental Anomalies

**User Story:** As a player, I want to experience room-wide atmospheric changes, so that I detect large-scale disturbances.

#### Acceptance Criteria

1. WHEN a "temperature_drop" anomaly is triggered, THE Anomaly_System SHALL apply frost visual effects to Room surfaces
2. WHEN a "fog_room" anomaly is triggered, THE Anomaly_System SHALL reduce visibility with fog particle effects
3. WHEN a "red_tint" anomaly is triggered, THE Anomaly_System SHALL apply red color grading to the Room lighting
4. WHEN a "gravity_shift" anomaly is triggered, THE Anomaly_System SHALL rotate small objects 90 degrees to simulate gravity change
5. WHEN a "time_freeze" anomaly is triggered, THE Anomaly_System SHALL stop all clock animations in the Room
6. WHEN a "static_noise" anomaly is triggered, THE Anomaly_System SHALL apply visual static overlay to the camera feed

### Requirement 5: Implement Electronic Device Anomalies

**User Story:** As a player, I want to see electronic devices activating unexpectedly, so that I experience technology-based horror.

#### Acceptance Criteria

1. WHEN a TV is present and no other TV anomaly is active, THE Anomaly_System SHALL support "tv_on_empty_room" (TV turns on when room is unoccupied)
2. WHEN a computer monitor is present, THE Anomaly_System SHALL support "monitor_glitch" (screen displays corrupted imagery)
3. WHEN a phone is present, THE Anomaly_System SHALL support "phone_ringing" (phone rings with no caller)
4. WHEN a radio is present, THE Anomaly_System SHALL support "radio_static" (radio plays static noise)
5. WHEN multiple electronic devices are present, THE Anomaly_System SHALL support "all_electronics_on" (all devices activate simultaneously)

### Requirement 6: Enhance Room Furniture Density

**User Story:** As a developer, I want rooms to contain more furniture and decorative objects, so that environments feel realistic and provide more anomaly targets.

#### Acceptance Criteria

1. THE Room_Manager SHALL add at least 5 additional Furniture_Objects to each existing Room
2. WHEN creating a living room, THE Room_Manager SHALL include paintings, clocks, cushions, lamps, and side tables
3. WHEN creating a bedroom, THE Room_Manager SHALL include nightstand lamps, wall art, dresser, and closet
4. WHEN creating a kitchen, THE Room_Manager SHALL include utensils, appliances, cabinets, and wall clock
5. WHEN creating an office, THE Room_Manager SHALL include bookshelf, desk lamp, filing cabinet, and wall calendar
6. WHEN creating a bathroom, THE Room_Manager SHALL include towels, mirror, shower curtain, and toiletries
7. WHEN creating a hallway, THE Room_Manager SHALL include coat rack, shoe rack, wall photos, and console table

### Requirement 7: Create New Room Types

**User Story:** As a player, I want to explore new room locations, so that gameplay variety increases.

#### Acceptance Criteria

1. THE Room_Manager SHALL support a "basement" Room with concrete walls, storage boxes, water heater, and dim lighting
2. THE Room_Manager SHALL support an "attic" Room with sloped ceiling, old furniture, cobwebs, and dusty boxes
3. THE Room_Manager SHALL support a "garage" Room with car, workbench, tools, and garage door
4. THE Room_Manager SHALL support a "nursery" Room with crib, toys, rocking chair, and mobile
5. FOR ALL new Room types, THE Room_Manager SHALL provide unique furniture layouts and atmospheric lighting
6. FOR ALL new Room types, THE Room_Manager SHALL support at least 15 Anomaly_Types

### Requirement 8: Maintain Architectural Standards

**User Story:** As a developer, I want code files to remain under 200 lines, so that the codebase stays maintainable.

#### Acceptance Criteria

1. THE Anomaly_System SHALL decompose anomaly.js if it exceeds 160 lines during implementation
2. THE Room_Manager SHALL decompose room-setups.js if it exceeds 160 lines during implementation
3. WHEN main.js is refactored, THE system SHALL split it into files under 200 lines each
4. FOR ALL new source files, THE system SHALL enforce a 200-line maximum
5. WHEN a file approaches 160 lines, THE system SHALL propose decomposition into logical modules

### Requirement 9: Preserve Test Coverage

**User Story:** As a developer, I want to maintain 90%+ test coverage, so that code quality remains high.

#### Acceptance Criteria

1. FOR ALL new Anomaly_Types, THE system SHALL provide unit tests verifying trigger and resolve behavior
2. FOR ALL new Room types, THE system SHALL provide unit tests verifying furniture placement and lighting
3. WHEN new code is added, THE system SHALL maintain at least 90% line coverage
4. WHEN refactoring existing code, THE system SHALL preserve all 131 existing passing tests
5. FOR ALL Autonomous_Anomalies, THE system SHALL provide tests verifying animation state updates

### Requirement 10: Update UI for New Anomaly Types

**User Story:** As a player, I want the report menu to include all new anomaly types, so that I can report any anomaly I detect.

#### Acceptance Criteria

1. WHEN the report menu is opened, THE UI SHALL display all 30+ Anomaly_Types in the type dropdown
2. THE UI SHALL organize Anomaly_Types into logical categories (Object, Environmental, Autonomous, Electronic)
3. WHEN a player selects an Anomaly_Type, THE UI SHALL display a brief description of the anomaly
4. THE UI SHALL maintain alphabetical sorting within each category
5. THE UI SHALL support keyboard navigation through the anomaly type list

### Requirement 11: Balance Anomaly Spawn Rates

**User Story:** As a player, I want anomalies to spawn at a challenging but fair rate, so that gameplay remains balanced.

#### Acceptance Criteria

1. THE Anomaly_System SHALL maintain the existing 15-25 second Spawn_Rate range
2. WHEN selecting an Anomaly_Type, THE Anomaly_System SHALL weight selection based on Room compatibility
3. THE Anomaly_System SHALL prevent duplicate Anomaly_Types in the same Room simultaneously
4. WHEN 5 anomalies are active, THE Anomaly_System SHALL trigger game over
5. THE Anomaly_System SHALL ensure at least 3 different Anomaly_Types appear in each 2-hour game session

### Requirement 12: Implement Anomaly Serialization

**User Story:** As a developer, I want to serialize and deserialize anomaly states, so that game state can be saved and restored.

#### Acceptance Criteria

1. THE Anomaly_System SHALL provide a serialization function that converts active anomalies to JSON
2. THE Anomaly_System SHALL provide a deserialization function that restores anomalies from JSON
3. FOR ALL Anomaly_Types, serialization then deserialization SHALL produce equivalent game state (round-trip property)
4. WHEN an Autonomous_Anomaly is serialized, THE Anomaly_System SHALL preserve animation state
5. WHEN deserialization fails, THE Anomaly_System SHALL return a descriptive error message

### Requirement 13: Add Sound Effects for New Anomalies

**User Story:** As a player, I want to hear audio cues for different anomaly types, so that I can detect anomalies through sound.

#### Acceptance Criteria

1. WHEN a "phone_ringing" anomaly is triggered, THE system SHALL play a phone ring sound effect
2. WHEN a "dripping_faucet" anomaly is triggered, THE system SHALL play periodic water drip sounds
3. WHEN a "radio_static" anomaly is triggered, THE system SHALL play static noise audio
4. WHEN a "door_ajar" anomaly is triggered, THE system SHALL play a creaking door sound
5. WHEN a "rocking_chair" anomaly is triggered, THE system SHALL play periodic wood creaking sounds
6. FOR ALL sound effects, THE system SHALL support volume adjustment based on camera distance from anomaly

### Requirement 14: Implement Anomaly Difficulty Tiers

**User Story:** As a player, I want some anomalies to be more subtle than others, so that detection requires careful observation.

#### Acceptance Criteria

1. THE Anomaly_System SHALL classify each Anomaly_Type as "obvious", "moderate", or "subtle" difficulty
2. WHEN spawning an anomaly, THE Anomaly_System SHALL select 40% obvious, 40% moderate, and 20% subtle anomalies
3. THE Anomaly_System SHALL assign higher point values to subtle anomalies when resolved
4. WHEN a subtle anomaly is missed, THE Anomaly_System SHALL apply a smaller penalty than obvious anomalies
5. THE UI SHALL display difficulty indicators in the shift report for educational purposes

### Requirement 15: Add Combination Anomalies

**User Story:** As a player, I want to occasionally see multiple related anomalies trigger together, so that gameplay becomes more challenging.

#### Acceptance Criteria

1. WHERE combination mode is enabled, THE Anomaly_System SHALL support triggering 2-3 related Anomaly_Types simultaneously
2. WHEN a "power_outage" combination is triggered, THE Anomaly_System SHALL disable all lights and activate all electronics
3. WHEN a "poltergeist" combination is triggered, THE Anomaly_System SHALL trigger multiple object displacement anomalies
4. WHEN a combination anomaly is triggered, THE Anomaly_System SHALL count it as a single anomaly for the 5-anomaly limit
5. THE Anomaly_System SHALL require all component anomalies to be reported to resolve a combination anomaly

### Requirement 16: Implement Anomaly Persistence Tracking

**User Story:** As a developer, I want to track how long each anomaly remains undetected, so that player performance metrics are accurate.

#### Acceptance Criteria

1. WHEN an Anomaly is triggered, THE Anomaly_System SHALL record the trigger timestamp
2. WHEN an Anomaly is resolved, THE Anomaly_System SHALL calculate the detection duration
3. THE Anomaly_System SHALL maintain a history of detection durations for all resolved anomalies
4. WHEN the shift report is displayed, THE UI SHALL show average detection time per Room
5. THE Anomaly_System SHALL identify the fastest and slowest detected anomalies in the shift report

### Requirement 17: Add Anomaly Visual Intensity Scaling

**User Story:** As a player, I want anomalies to become more visually intense the longer they remain undetected, so that I'm encouraged to act quickly.

#### Acceptance Criteria

1. WHEN an Anomaly remains undetected for 30 seconds, THE Anomaly_System SHALL increase its visual intensity by 20%
2. WHEN an Anomaly remains undetected for 60 seconds, THE Anomaly_System SHALL increase its visual intensity by 50%
3. WHEN a "light" anomaly intensifies, THE Anomaly_System SHALL increase brightness or color saturation
4. WHEN an "extra" anomaly intensifies, THE Anomaly_System SHALL increase opacity or size
5. WHEN an Anomaly is resolved, THE Anomaly_System SHALL reset visual intensity to baseline

### Requirement 18: Implement Room-Specific Anomaly Pools

**User Story:** As a developer, I want certain anomalies to only appear in appropriate rooms, so that gameplay feels logical and immersive.

#### Acceptance Criteria

1. THE Anomaly_System SHALL restrict "dripping_faucet" anomalies to bathroom and kitchen Rooms
2. THE Anomaly_System SHALL restrict "monitor_glitch" anomalies to office and bedroom Rooms
3. THE Anomaly_System SHALL restrict "shower_curtain" anomalies to bathroom Rooms
4. THE Anomaly_System SHALL allow "light" and "intruder" anomalies in all Room types
5. WHEN selecting an Anomaly_Type, THE Anomaly_System SHALL only choose from the Room's compatible anomaly pool

### Requirement 19: Add Anomaly Preview Mode

**User Story:** As a player, I want to view all anomaly types in study mode, so that I can learn to recognize them before playing.

#### Acceptance Criteria

1. WHEN study mode is active, THE UI SHALL provide a "Cycle Anomalies" button
2. WHEN the "Cycle Anomalies" button is clicked, THE Anomaly_System SHALL trigger the next Anomaly_Type in the current Room
3. THE UI SHALL display the current Anomaly_Type name and description during study mode
4. WHEN all Anomaly_Types for a Room have been cycled, THE UI SHALL display a completion message
5. THE Anomaly_System SHALL not count study mode anomalies toward game statistics

### Requirement 20: Implement Anomaly Conflict Resolution

**User Story:** As a developer, I want to prevent conflicting anomalies from triggering simultaneously, so that game state remains consistent.

#### Acceptance Criteria

1. THE Anomaly_System SHALL prevent "light" and "blackout" anomalies from affecting the same Room simultaneously
2. THE Anomaly_System SHALL prevent multiple "displaced" anomalies from targeting the same Furniture_Object
3. THE Anomaly_System SHALL prevent "missing" and "extra" anomalies from targeting the same Furniture_Object
4. WHEN an Anomaly_Type conflicts with an active anomaly, THE Anomaly_System SHALL select an alternative Anomaly_Type
5. THE Anomaly_System SHALL maintain a conflict matrix defining incompatible Anomaly_Type pairs
