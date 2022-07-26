module.exports = (sequelize, DataTypes) => {
  const {TEXT, GEOMETRY, NUMBER, DOUBLE, REAL, INTEGER, DATE, BOOLEAN} =
    DataTypes;
  const LocationsMapGraphMode = sequelize.define(
    'locations_map_graph_mode',
    {
      benchmark_scale_median: {
        type: INTEGER,
      },
      reach_ndx: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
      },
      location_geometry: {
        type: GEOMETRY,
      },
      parameter_ndx: {
        type: INTEGER,
      },
      ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      parameter_group_name: {
        type: TEXT,
      },
      huc12: {
        type: TEXT,
      },
      huc8: {
        type: TEXT,
      },
      latitude: {
        type: DOUBLE,
      },
      organization_name: {
        type: TEXT,
      },
      por_end: {
        type: DATE,
      },
      por_start: {
        type: DATE,
      },
      location_id: {
        type: TEXT,
      },
      trend: {
        type: TEXT,
      },
      stats_period: {
        type: TEXT,
      },
      units: {
        type: TEXT,
      },
      median: {
        type: TEXT,
      },
      parameter: {
        type: TEXT,
      },
      benchmark_scale_pctile85: {
        type: INTEGER,
      },
      longitude: {
        type: DOUBLE,
      },
      recordcount: {
        type: NUMBER,
      },
      location_name: {
        type: TEXT,
      },
      reach_name: {
        type: TEXT,
      },
      pctile85: {
        type: REAL,
      },
      low_is_bad: {
        type: BOOLEAN,
      },
      bmk_line0: {
        type: REAL,
      },
      bmk_line1: {
        type: REAL,
      },
      bmk_line2: {
        type: REAL,
      },
      bmk_line3: {
        type: REAL,
      },
      bmk_line4: {
        type: REAL,
      },
    },
    {
      schema: 'ui',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return LocationsMapGraphMode;
};
