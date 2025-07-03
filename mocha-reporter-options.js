module.exports = {
  reporterEnabled : 'spec, xunit',
  xunitReporterOptions : {
    suiteName : process.env.SUITE_NAME || 'OpenSIGL Test',
    output : process.env.MOCHA_OUTPUT || 'xunit.xml',
  },
};
