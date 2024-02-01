module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverage: true,
    clearMocks: true,
    coverageDirectory: "coverage",
    setupFiles: [
        "<rootDir>/src/testing/util/v-internal-setup-document.ts"
    ],
    timers: "fake"
};
