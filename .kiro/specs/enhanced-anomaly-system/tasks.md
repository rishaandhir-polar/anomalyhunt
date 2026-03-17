# Implementation Plan: Enhanced Anomaly System

## Overview

This implementation plan expands the anomaly detection game from 7 to 30+ anomaly types while maintaining architectural standards (200-line file cap) and 90%+ test coverage. The approach follows a decomposition-first strategy to bring existing files under the line limit, then incrementally adds new anomaly categories, room types, and gameplay mechanics. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [x] 1. Decompose main.js into modular components
  - [x] 1.1 Create core/game-state.js module
    - Extract game loop, timer, anomaly spawning, and end game logic from main.js
    - Implement GameState class with state management (LOBBY, STUDY, PLAYING, OVER)
    - Move startMission(), gameLoop(), endGame(), and time formatting functions
    - Target: ~95 lines
    - _Requirements: 8.3_
  
  - [x] 1.2 Create ui/game-ui.js module
    - Extract camera switching, report menu, and UI state management from main.js
    - Implement GameUI class with switchCamera(), openReportMenu(), closeReportMenu(), submitReport()
    - Move study mode functions (enterStudyMode, cycleAnomaly)
    - Target: ~90 lines
    - _Requirements: 8.3, 10.1_
  
  - [x] 1.3 Refactor main.js to entry point
    - Reduce main.js to initialization and module wiring only
    - Import and instantiate GameState, GameUI, Engine, SoundManager
    - Wire event listeners to GameUI methods
    - Target: ~60 lines
    - _Requirements: 8.3, 8.4_
  
  - [ ]* 1.4 Write unit tests for decomposed modules
    - Test GameState state transitions and timer formatting
    - Test GameUI camera switching and menu interactions
    - Verify all 131 existing tests still pass
    - _Requirements: 9.4_

- [x] 2. Decompose anomaly.js into category modules
  - [x] 2.1 Create entities/anomaly-types/object-anomalies.js
    - Export OBJECT_ANOMALY_TYPES array with 12 types (displaced, extra, missing, painting, tv, chair_floor, books_floating, lamp_flickering, cushion_displaced, door_ajar, curtains_moving, mirror_reflection)
    - Implement applyObjectAnomaly() and resolveObjectAnomaly() functions
    - Handle furniture reference checks and fallback logic
    - Target: ~80 lines
    - _Requirements: 1.1, 1.3, 2.1-2.8_
  
  - [x] 2.2 Create entities/anomaly-types/autonomous-anomalies.js
    - Export AUTONOMOUS_ANOMALY_TYPES array with 5 types (rocking_chair, spinning_fan, dripping_faucet, swinging_light, crawling_shadow)
    - Implement applyAutonomousAnomaly(), resolveAutonomousAnomaly(), updateAutonomousAnomaly() functions
    - Initialize animation state (phase, direction, speed) for each type
    - Target: ~70 lines
    - _Requirements: 1.1, 1.3, 1.5, 3.1-3.6_
  
  - [x] 2.3 Create entities/anomaly-types/environmental-anomalies.js
    - Export ENVIRONMENTAL_ANOMALY_TYPES array with 7 types (temperature_drop, fog_room, red_tint, gravity_shift, time_freeze, static_noise, light)
    - Implement applyEnvironmentalAnomaly() and resolveEnvironmentalAnomaly() functions
    - Apply room-wide visual effects (fog particles, color grading, frost effects)
    - Target: ~60 lines
    - _Requirements: 1.1, 1.3, 4.1-4.6_
  
  - [x] 2.4 Create entities/anomaly-types/electronic-anomalies.js
    - Export ELECTRONIC_ANOMALY_TYPES array with 5 types (tv_on_empty_room, monitor_glitch, phone_ringing, radio_static, all_electronics_on)
    - Implement applyElectronicAnomaly() and resolveElectronicAnomaly() functions
    - Handle electronic device activation and sound triggering
    - Target: ~50 lines
    - _Requirements: 1.1, 1.3, 5.1-5.5_
  
  - [x] 2.5 Refactor entities/anomaly.js to orchestration layer
    - Keep AnomalyManager class with core methods (triggerRandomAnomaly, resolveAnomaly)
    - Import and delegate to category modules (applyObjectAnomaly, applyAutonomousAnomaly, etc.)
    - Maintain activeAnomalies, undetectedCount, totalTriggered, totalResolved state
    - Add room compatibility matrix (ROOM_ANOMALY_COMPATIBILITY)
    - Target: ~120 lines
    - _Requirements: 1.2, 8.1, 18.5_
  
  - [ ]* 2.6 Write property test for room compatibility enforcement
    - **Property 1: Room Compatibility Enforcement**
    - **Validates: Requirements 1.2, 11.2, 18.5**
    - Generate random rooms and verify triggered anomalies are in compatibility list
    - Use fast-check with 100 iterations
  
  - [ ]* 2.7 Write property test for anomaly application
    - **Property 2: Anomaly Application Produces Detectable Change**
    - **Validates: Requirements 1.4**
    - Generate random anomaly types and verify room state changes occur
    - Use fast-check with 100 iterations
  
  - [ ]* 2.8 Write unit tests for anomaly category modules
    - Test each of the 30+ anomaly types can be applied and resolved
    - Verify visual/behavioral changes for specific examples
    - Test error handling for missing furniture references
    - _Requirements: 1.6, 9.1_

- [x] 3. Checkpoint - Verify decomposition and existing tests
  - Ensure all 131 existing tests pass, ask the user if questions arise.

- [x] 4. Decompose room-setups.js and enhance existing rooms
  - [x] 4.1 Enhance setupLivingRoom with 5+ new furniture objects
    - Add paintings (2), clock, cushions (3), lamp (pole + shade), side table, curtains, mirror
    - Assign furniture references to room object (room.cushions, room.clock, room.lamp, etc.)
    - Maintain existing furniture (couch, tv, coffee table, rug)
    - _Requirements: 6.1, 6.2_
  
  - [x] 4.2 Enhance setupBedroom with 5+ new furniture objects
    - Add nightstand lamps (2), wall art, dresser, closet, mirror
    - Assign furniture references to room object
    - Maintain existing furniture (bed, nightstand, wardrobe)
    - _Requirements: 6.1, 6.3_
  
  - [x] 4.3 Enhance setupKitchen with 5+ new furniture objects
    - Add utensils, appliances, cabinets (3), wall clock, faucet
    - Assign furniture references to room object (room.faucet, room.cabinets, room.clock)
    - Maintain existing furniture (counter, stove, sink, fridge)
    - _Requirements: 6.1, 6.4_
  
  - [x] 4.4 Enhance setupOffice with 5+ new furniture objects
    - Add bookshelf, desk lamp, filing cabinet, wall calendar, monitor, ceiling fan
    - Assign furniture references to room object (room.monitor, room.ceilingFan, room.bookshelf)
    - Maintain existing furniture (desk, chair, computer)
    - _Requirements: 6.1, 6.5_
  
  - [x] 4.5 Enhance setupBathroom with 5+ new furniture objects
    - Add towels (3), mirror, shower curtain, toiletries, faucet
    - Assign furniture references to room object (room.faucet, room.showerCurtain, room.towels)
    - Maintain existing furniture (toilet, sink, bathtub)
    - _Requirements: 6.1, 6.6_
  
  - [x] 4.6 Enhance setupHallway with 5+ new furniture objects
    - Add coat rack, shoe rack, wall photos (3), console table
    - Assign furniture references to room object
    - Maintain existing furniture (table, plant)
    - _Requirements: 6.1, 6.7_
  
  - [ ]* 4.7 Write unit tests for enhanced room setups
    - Test each room creates expected furniture count (minimum 5 new objects)
    - Verify furniture references are properly assigned
    - Test room dimensions and lighting remain correct
    - _Requirements: 9.2_

- [x] 5. Create new room types in room-setups-extended.js
  - [x] 5.1 Create entities/room-setups-extended.js module
    - Create file for new room setup functions
    - Import Room class and texture utilities
    - Target: ~150 lines for 4 new room types
    - _Requirements: 7.5, 8.2_
  
  - [x] 5.2 Implement setupBasement function
    - Create room with concrete walls, dim lighting (intensity 0.3)
    - Add storage boxes (5), water heater, shelving units, exposed pipes
    - Assign furniture references (room.waterHeater, room.storageBoxes)
    - Support 15+ anomaly types per compatibility matrix
    - _Requirements: 7.1, 7.6_
  
  - [x] 5.3 Implement setupAttic function
    - Create room with sloped ceiling, dusty atmosphere
    - Add old furniture (3), cobwebs (4), dusty boxes (4), window
    - Assign furniture references (room.oldFurniture, room.cobwebs)
    - Support 15+ anomaly types per compatibility matrix
    - _Requirements: 7.2, 7.6_
  
  - [x] 5.4 Implement setupGarage function
    - Create room with concrete floor, garage door
    - Add car (group with body, wheels), workbench, tools (5), storage shelves
    - Assign furniture references (room.car, room.workbench, room.tools)
    - Support 15+ anomaly types per compatibility matrix
    - _Requirements: 7.3, 7.6_
  
  - [x] 5.5 Implement setupNursery function
    - Create room with soft lighting, pastel colors
    - Add crib, toys (5), rocking chair, mobile (hanging), dresser, wall decorations
    - Assign furniture references (room.crib, room.toys, room.rockingChair, room.mobile)
    - Support 15+ anomaly types per compatibility matrix
    - _Requirements: 7.4, 7.6_
  
  - [ ]* 5.6 Write unit tests for new room types
    - Test each new room type creates expected furniture objects
    - Verify furniture references are properly assigned
    - Test room dimensions, lighting, and atmospheric properties
    - Verify minimum 15 compatible anomaly types per room
    - _Requirements: 9.2, 7.6_

- [x] 6. Checkpoint - Verify room enhancements and new rooms
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement anomaly serialization and deserialization
  - [x] 7.1 Add serialize() method to AnomalyManager
    - Convert activeAnomalies array to JSON format
    - Include anomaly id, room, type, category, difficulty, triggerTime, intensity
    - For autonomous anomalies, include animationState (phase, direction, speed)
    - Include roomLog and statistics (undetectedCount, totalTriggered, totalResolved)
    - Return JSON string with version field
    - _Requirements: 12.1, 12.4_
  
  - [x] 7.2 Add deserialize() method to AnomalyManager
    - Parse JSON string and validate format (check version, required fields)
    - Restore activeAnomalies array with proper object references
    - Restore roomLog and statistics
    - Return error object with descriptive message on failure
    - _Requirements: 12.2, 12.5_
  
  - [ ]* 7.3 Write property test for serialization round trip
    - **Property 6: Serialization Round Trip**
    - **Validates: Requirements 12.3**
    - Generate random game states with active anomalies
    - Verify serialize then deserialize produces equivalent state
    - Use fast-check with 100 iterations
  
  - [ ]* 7.4 Write property test for deserialization error handling
    - **Property 7: Deserialization Error Handling**
    - **Validates: Requirements 12.5**
    - Generate random malformed JSON strings
    - Verify graceful error handling without exceptions
    - Use fast-check with 100 iterations
  
  - [ ]* 7.5 Write unit tests for serialization edge cases
    - Test serialization of empty state (no active anomalies)
    - Test deserialization with missing fields
    - Test deserialization with invalid version
    - _Requirements: 12.5_

- [x] 8. Implement sound effects for new anomaly types
  - [x] 8.1 Add sound effect triggering to AnomalyManager
    - Add playSoundForAnomaly() method
    - Create sound mapping (phone_ringing → phone_ring, dripping_faucet → water_drip, etc.)
    - Calculate volume based on camera distance (falloff over 20 units)
    - Call soundManager.playSound() with calculated volume
    - _Requirements: 13.1-13.5_
  
  - [x] 8.2 Integrate sound triggering into triggerRandomAnomaly()
    - Call playSoundForAnomaly() after applying anomaly
    - Pass anomaly object to sound function
    - _Requirements: 13.1-13.5_
  
  - [ ]* 8.3 Write property test for sound volume distance falloff
    - **Property 8: Sound Volume Distance Falloff**
    - **Validates: Requirements 13.6**
    - Generate random distances and verify monotonic volume decrease
    - Use fast-check with 100 iterations
  
  - [ ]* 8.4 Write unit tests for sound integration
    - Test sound triggering for each sound-enabled anomaly type
    - Verify volume calculation at specific distances (0, 10, 20, 30 units)
    - Test no sound for anomalies without audio
    - _Requirements: 13.6_

- [x] 9. Implement difficulty tiers and weighted spawning
  - [x] 9.1 Add difficulty classification to AnomalyManager
    - Create DIFFICULTY_TIERS constant (obvious: 7 types, moderate: 15 types, subtle: 8 types)
    - Add getDifficulty() method that returns difficulty for a given anomaly type
    - Add difficultyWeights property {obvious: 0.4, moderate: 0.4, subtle: 0.2}
    - _Requirements: 14.1, 14.2_
  
  - [x] 9.2 Implement weighted anomaly selection in triggerRandomAnomaly()
    - Select difficulty tier based on weights (40% obvious, 40% moderate, 20% subtle)
    - Filter compatible types by selected difficulty
    - Select random type from filtered list
    - Store difficulty in anomaly object
    - _Requirements: 14.2_
  
  - [ ]* 9.3 Write property test for difficulty distribution
    - **Property 9: Difficulty Distribution**
    - **Validates: Requirements 14.2**
    - Generate 100 anomaly spawns
    - Verify distribution approximates 40/40/20 (within 10% tolerance)
    - Use fast-check with 100 iterations
  
  - [ ]* 9.4 Write unit tests for difficulty classification
    - Test getDifficulty() returns correct tier for each anomaly type
    - Test weighted selection produces expected distribution over 1000 samples
    - _Requirements: 14.1, 14.2_

- [x] 10. Checkpoint - Verify serialization, sound, and difficulty systems
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement conflict resolution system
  - [x] 11.1 Add conflict matrix to AnomalyManager
    - Create CONFLICT_MATRIX constant with incompatible anomaly pairs
    - Define conflicts: light/blackout/red_tint, displaced/missing/extra, time_freeze/autonomous, fog_room/static_noise
    - _Requirements: 20.1, 20.3, 20.5_
  
  - [x] 11.2 Add checkConflict() method to AnomalyManager
    - Check if proposed anomaly type conflicts with any active anomaly in target room
    - Return boolean indicating conflict status
    - _Requirements: 20.4_
  
  - [x] 11.3 Integrate conflict checking into triggerRandomAnomaly()
    - Before applying anomaly, call checkConflict()
    - If conflict detected, select alternative non-conflicting type from compatibility pool
    - If no alternatives exist, skip spawning this cycle
    - _Requirements: 20.4_
  
  - [ ]* 11.4 Write property test for no same-target conflicts
    - **Property 10: No Same-Target Conflicts**
    - **Validates: Requirements 20.2, 20.3**
    - Generate multiple anomalies per room
    - Verify no two anomalies target same object with conflicting types
    - Use fast-check with 100 iterations
  
  - [ ]* 11.5 Write property test for conflict resolution
    - **Property 11: Conflict Resolution Selects Alternative**
    - **Validates: Requirements 20.4**
    - Generate conflicting anomaly scenarios
    - Verify system selects non-conflicting alternative
    - Use fast-check with 100 iterations
  
  - [ ]* 11.6 Write unit tests for conflict resolution
    - Test specific conflict pairs (light + blackout, displaced + missing)
    - Verify alternative selection when conflicts occur
    - Test behavior when no alternatives exist
    - _Requirements: 20.1-20.5_

- [x] 12. Implement duplicate prevention system
  - [x] 12.1 Add duplicate checking to triggerRandomAnomaly()
    - Before applying anomaly, check if same type already active in target room
    - If duplicate detected, select different type from compatibility pool
    - _Requirements: 11.3_
  
  - [ ]* 12.2 Write property test for duplicate prevention
    - **Property 5: No Duplicate Types Per Room**
    - **Validates: Requirements 11.3**
    - Generate multiple anomalies per room
    - Verify no two active anomalies have same type in same room
    - Use fast-check with 100 iterations
  
  - [ ]* 12.3 Write unit tests for duplicate prevention
    - Test duplicate detection for same type in same room
    - Verify different types allowed in same room
    - Verify same type allowed in different rooms
    - _Requirements: 11.3_

- [x] 13. Implement autonomous anomaly animation updates
  - [x] 13.1 Add updateAutonomousAnomalies() to GameState game loop
    - Call updateAutonomousAnomaly() for each autonomous anomaly
    - Pass deltaTime to animation update function
    - Update animation state (phase, rotation, position) per frame
    - _Requirements: 1.5, 3.6_
  
  - [ ]* 13.2 Write property test for autonomous anomaly state updates
    - **Property 3: Autonomous Anomaly State Updates**
    - **Validates: Requirements 1.5, 3.6**
    - Generate random autonomous anomalies
    - Verify calling update with positive deltaTime modifies animation state
    - Use fast-check with 100 iterations
  
  - [ ]* 13.3 Write unit tests for autonomous animations
    - Test rocking_chair rotation updates correctly
    - Test spinning_fan continuous rotation
    - Test dripping_faucet periodic water drops
    - Test swinging_light pendulum motion
    - Test crawling_shadow position updates
    - _Requirements: 3.1-3.6, 9.5_

- [x] 14. Implement visual intensity scaling
  - [x] 14.1 Add updateIntensity() method to AnomalyManager
    - Calculate elapsed time since anomaly trigger
    - Set intensity to 1.2 after 30 seconds, 1.5 after 60 seconds
    - Call applyIntensityModifier() for each anomaly
    - _Requirements: 17.1, 17.2_
  
  - [x] 14.2 Implement applyIntensityModifier() for each category
    - For light anomalies: increase brightness/color saturation
    - For extra/intruder anomalies: increase opacity or size
    - For lamp_flickering: increase flicker frequency
    - Reset intensity to 1.0 on resolution
    - _Requirements: 17.3, 17.4, 17.5_
  
  - [x] 14.3 Integrate intensity updates into GameState game loop
    - Call anomalyManager.updateIntensity(deltaTime) each frame
    - _Requirements: 17.1, 17.2_
  
  - [ ]* 14.4 Write unit tests for intensity scaling
    - Test intensity increases at 30s and 60s thresholds
    - Test intensity modifiers for different anomaly types
    - Test intensity reset on resolution
    - _Requirements: 17.1-17.5_

- [x] 15. Checkpoint - Verify conflict resolution, duplicates, animations, and intensity
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Update UI for new anomaly types
  - [x] 16.1 Update report menu dropdown with all 30+ anomaly types
    - Organize types into categories (Object, Autonomous, Environmental, Electronic)
    - Sort alphabetically within each category
    - Add category headers in dropdown
    - _Requirements: 10.1, 10.2, 10.4_
  
  - [x] 16.2 Add anomaly descriptions to report menu
    - Display brief description when anomaly type is selected
    - Create description mapping for all 30+ types
    - _Requirements: 10.3_
  
  - [x] 16.3 Implement keyboard navigation for anomaly type list
    - Support arrow keys to navigate dropdown
    - Support Enter to select
    - Support Escape to close menu
    - _Requirements: 10.5_
  
  - [ ]* 16.4 Write unit tests for UI updates
    - Test all 30+ anomaly types appear in dropdown
    - Test category organization and sorting
    - Test description display for each type
    - Test keyboard navigation events
    - _Requirements: 10.1-10.5_

- [x] 17. Implement anomaly preview mode (study mode enhancements)
  - [x] 17.1 Add cycleAnomaly() enhancement to GameUI
    - Track current anomaly index per room
    - Trigger next anomaly type from room's compatibility list
    - Display anomaly name and description in UI
    - Show completion message when all types cycled
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  
  - [x] 17.2 Add study mode flag to AnomalyManager
    - Prevent study mode anomalies from counting toward statistics
    - Set studyMode flag when triggering from cycleAnomaly()
    - _Requirements: 19.5_
  
  - [ ]* 17.3 Write unit tests for preview mode
    - Test cycleAnomaly() triggers each type in sequence
    - Test completion message after all types cycled
    - Test study mode anomalies don't affect statistics
    - _Requirements: 19.1-19.5_

- [x] 18. Implement anomaly persistence tracking
  - [x] 18.1 Add detection duration tracking to AnomalyManager
    - Record triggerTime when anomaly is created (already in design)
    - Calculate duration on resolution (currentTime - triggerTime)
    - Store duration in detectionHistory array
    - _Requirements: 16.1, 16.2, 16.3_
  
  - [x] 18.2 Add per-room statistics to roomLog
    - Track average detection time per room
    - Track fastest and slowest detected anomalies
    - _Requirements: 16.4, 16.5_
  
  - [ ]* 18.3 Write unit tests for persistence tracking
    - Test duration calculation for resolved anomalies
    - Test detection history storage
    - Test per-room statistics calculation
    - _Requirements: 16.1-16.5_

- [x] 19. Implement spawn delay and timing
  - [x] 19.1 Add getSpawnDelay() method to GameState
    - Return random value between 15000 and 25000 milliseconds
    - Use Math.random() * 10000 + 15000
    - _Requirements: 11.1_
  
  - [ ]* 19.2 Write property test for spawn delay range
    - **Property 4: Spawn Delay Within Range**
    - **Validates: Requirements 11.1**
    - Generate many spawn delays
    - Verify all values between 15000 and 25000
    - Use fast-check with 100 iterations
  
  - [ ]* 19.3 Write unit tests for spawn timing
    - Test getSpawnDelay() returns values in correct range over 1000 samples
    - Test anomaly spawning respects delay timing
    - _Requirements: 11.1_

- [x] 20. Wire new rooms into game engine
  - [x] 20.1 Update Engine to import room-setups-extended.js
    - Import setupBasement, setupAttic, setupGarage, setupNursery
    - Add new room types to rooms array
    - Update camera count and positions for 10 total rooms
    - _Requirements: 7.1-7.4_
  
  - [x] 20.2 Update room switching logic in GameUI
    - Support 10 camera positions (6 existing + 4 new)
    - Update camera index bounds checking
    - _Requirements: 7.1-7.4_
  
  - [ ]* 20.3 Write integration tests for new rooms
    - Test engine creates all 10 room types
    - Test camera switching works for all rooms
    - Test anomalies can be triggered in new rooms
    - _Requirements: 7.1-7.4, 7.6_

- [x] 21. Final integration and wiring
  - [x] 21.1 Verify all modules are properly imported and wired
    - Check main.js imports all necessary modules
    - Verify GameState, GameUI, AnomalyManager, Engine integration
    - Ensure all event listeners are connected
    - _Requirements: 8.3_
  
  - [x] 21.2 Update shift report to display new statistics
    - Show difficulty distribution in shift report
    - Display average detection time per room
    - Show fastest and slowest detected anomalies
    - _Requirements: 14.5, 16.4, 16.5_
  
  - [ ]* 21.3 Write integration tests for complete system
    - Test full game loop with new anomaly types
    - Test serialization/deserialization during active game
    - Test conflict resolution in multi-anomaly scenarios
    - Test sound triggering with multiple active anomalies
    - _Requirements: 1.1, 11.5, 12.3, 13.6_

- [x] 22. Final checkpoint - Comprehensive testing
  - 233/233 tests passing
  - All files under 200-line cap
  - All 30+ anomaly types functional
  - All 10 room types functional

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (11 total)
- Unit tests validate specific examples, edge cases, and integration points
- All decomposition tasks prioritize staying under 200-line file cap
- Autonomous anomaly animations require per-frame updates in game loop
- Conflict resolution and duplicate prevention ensure consistent game state
- Serialization enables future save/load functionality
- Sound integration enhances immersion and detection cues
- Difficulty tiers and intensity scaling provide progressive challenge
