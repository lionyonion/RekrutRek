import pandas as pd
import random

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
df = pd.read_csv("merged_all_resumes.csv")

# Load embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def rank_candidates(
    category,
    required_skills,
    offered_salary=10
):

    filtered_df = df[
        df["category"] == category
    ].copy()

    # Dummy salary expectation
    random.seed(42)

    filtered_df["salary_expectation"] = [
        random.randint(5, 15)
        for _ in range(len(filtered_df))
    ]

    # Job text
    job_text = " ".join(
        required_skills
    )

    job_embedding = model.encode(
        job_text
    )

    final_scores = []

    for _, row in filtered_df.iterrows():

        candidate_text = str(
            row["extracted_skills"]
        )

        candidate_embedding = model.encode(
            candidate_text
        )

        similarity = cosine_similarity(
            [job_embedding],
            [candidate_embedding]
        )[0][0]

        skill_score = float(
            similarity * 100
        )

        # Salary score
        salary_expectation = row[
            "salary_expectation"
        ]

        salary_score = max(
            0,
            100 - (
                (salary_expectation - 5)
                * 10
            )
        )

        final_score = (
            0.8 * skill_score
            +
            0.2 * salary_score
        )

        final_scores.append(
            round(
                final_score,
                2
            )
        )

    filtered_df["score"] = final_scores

    ranked = filtered_df.sort_values(
        by="score",
        ascending=False
    )

    result = ranked[
        [
            "salary_expectation",
            "resume_id",
            "score",
            "extracted_skills"
        ]
    ].head(10)

    result.insert(
        0,
        "rank",
        range(
            1,
            len(result) + 1
        )
    )

    return result


if __name__ == "__main__":

    result = rank_candidates(
        "ACCOUNTANT",
        [
            "excel",
            "accounting",
            "budgeting"
        ],
        10
    )

    print(result)
