from ninja import Schema


class DefaultDatasetResponse(Schema):
    data: list[str]
    message: str


class AllDatasetResponse(Schema):
    data: dict
    message: str
