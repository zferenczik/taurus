var path = require('path'),
    async = require('async'),
    newman = require('newman'),
    TaurusReporter = require('./newman-reporter-taurus');

var options = {
    collection: path.join(process.cwd(), 'postman-sample-collection.json'),
    reporters: ['taurus'],
    reporter: {
        taurus: {
            filename: 'report.ldjson'
        }
    }
}

function parallelCollectionRun(done) {
    newman.run(options, done);
};

function epoch() {
    return (new Date).getTime();
}

function getNewmanRunner(_iterationLimit, _durationLimit) {
    let iterationLimit = _iterationLimit,
        durationLimit = _durationLimit,
        startTime = null,
        iterations = 0;

    return function run(done) {
        console.info('run');
        startTime = startTime || epoch();
        newman.run(options, results => {
            let now = epoch();
            iterations++;
            if (durationLimit && now > (startTime + durationLimit)) {
                done(results);
            }
            else if (iterationLimit && iterations >= iterationLimit) {
                done(results);
            }
            else {
                run(done);
            }
        });
    }
}

// concurrency = 3, iterations = 10
let runners = [
    getNewmanRunner(10, null),
    getNewmanRunner(10, null),
    getNewmanRunner(10, null),
]

// Runs the Postman sample collection thrice, in parallel.
async.parallel(runners,
    function (err, results) {
        err && console.error(err);

        results.forEach(function (result) {
            var failures = result.run.failures;

            if (failures.length > 0) {
                console.info('failures:', JSON.stringify(failures, null, 2))
            } else {
                console.info(`${result.collection.name} ran successfully.`)
            }
        });
    });
