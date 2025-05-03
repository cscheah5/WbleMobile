<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $weeks = 7; // duration
        $startDate = Carbon::parse('2025-06-01'); // set your start date here
        // Loop through each subject
        Subject::all()->each(function ($subject) use ($weeks, $startDate) {
            for ($i = 1; $i <= $weeks; $i++) {
                $weekStart = $startDate->copy()->addWeeks($i - 1);
                $weekEnd = $weekStart->copy()->addDays(6);

                Section::create([
                    'subject_id' => $subject->id,
                    'week_number' => $i,
                    'start_date' => $weekStart,
                    'end_date' => $weekEnd,
                    'topic' => "Week $i Topic for {$subject->name}",
                    'content' => "Content for Week $i of subject {$subject->name}",
                ]);
            }
        });
    }
}
