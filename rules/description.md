# Rules Description

This application is a web-based 3D visualization of Orthodox saints and historical figures, built using Cesium. The visualization presents these figures as points on a 3D globe, where:

- Each point represents a historical figure, with Orthodox saints being the primary focus
- The geographical location of each point corresponds to the figure's historical location
- The height (altitude) of each point is proportional to the figure's temporal position:
  - If both birth and death years are known: height represents the average of these years
  - If only one year is known (birth or death): height represents that known year
- Different types of historical figures are represented by distinct symbols
- Various types of connections between figures can be displayed, including:
  - "was guided by" relationships
  - "lived under" relationships
  - "knew" relationships
  - These connections are shown with either single or double arrows to indicate the nature and direction of the relationship 