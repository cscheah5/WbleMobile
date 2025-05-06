<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\Section;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $weeks = 7; // duration
        $startDate = Carbon::parse('2025-05-01'); // set your start date here
        
        // Loop through each subject
        Subject::all()->each(function ($subject) use ($weeks, $startDate) {
            Section::factory()->createSectionsForSubject($subject, $startDate, $weeks);
        });
    }
}
