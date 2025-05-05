<?php

namespace Database\Factories;

use App\Models\Section;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class SectionFactory extends Factory
{
    protected $model = Section::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'subject_id' => Subject::factory(),
            'week_number' => $this->faker->numberBetween(1, 14),
            'start_date' => now(),
            'end_date' => now()->addDays(6),
            'topic' => $this->faker->sentence(),
            'content' => $this->faker->paragraph(),
        ];
    }

    /**
     * Create sections for a subject with specified weeks and start date
     */
    public function createSectionsForSubject(Subject $subject, $startDate, int $numberOfWeeks): array
    {
        $startDate = $startDate instanceof Carbon ? $startDate : Carbon::parse($startDate);
        $sections = [];

        for ($i = 1; $i <= $numberOfWeeks; $i++) {
            $weekStart = $startDate->copy()->addWeeks($i - 1);
            $weekEnd = $weekStart->copy()->addDays(6);

            $sections[] = Section::create([
                'subject_id' => $subject->id,
                'week_number' => $i,
                'start_date' => $weekStart,
                'end_date' => $weekEnd,
            ]);
        }

        return $sections;
    }
}
