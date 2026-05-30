from fastapi import FastAPI
from pydantic import BaseModel
from ranking_engine import rank_candidates

app = FastAPI(
    title="RekrutRek AI Service",
    description="Candidate Recommendation and Ranking API",
    version="1.0.0"
)


class JobRequest(BaseModel):
    category: str
    required_skills: list[str]
    offered_salary: float


@app.get("/")
def home():
    return {
        "message": "RekrutRek AI Service Running"
    }


@app.post("/rank-candidates")
def rank_candidates_api(job: JobRequest):

    result = rank_candidates(
    job.category,
    job.required_skills,
    job.offered_salary
)

    return result.to_dict(
        orient="records"
    )
