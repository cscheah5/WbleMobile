<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all subjects
        $subjects = Subject::all();
        
        // Get user1 and user2
        $user1 = User::where('username', 'user1')->first();
        $user2 = User::where('username', 'user2')->first();
        
        // Create enrollments for user1
        foreach ($subjects as $subject) {
            Enrollment::create([
                'user_id' => $user1->id,
                'subject_id' => $subject->id,
            ]);
        }
        
        // Create enrollments for user2
        foreach ($subjects as $subject) {
            Enrollment::create([
                'user_id' => $user2->id,
                'subject_id' => $subject->id,
            ]);
        }
    }
}
