export const asyncWrapper = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        });
    };
};