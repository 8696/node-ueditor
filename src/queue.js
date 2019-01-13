
function Queue() {
    let queue = [],
        isIng = false,
        setIng = function (bo) {
            isIng = bo;
        },
        data = {},
        next = function () {
            setIng(false);
            exec();
        },
        exec = function () {
            if (queue.length > 0 && isIng === false) {
                setIng(true);
                queue.splice(0, 1)[0](next, data);
            }
        };

    this.push = function (handle) {
        queue.push(handle);
        exec();
        return this;
    };
    this.destroy = function () {
        data = null;
        queue = [];
        delete this.push;
        delete this.destroy;
    };
}


module.exports = Queue;
