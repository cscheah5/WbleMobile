<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Teaching;
use App\Models\Subject;
use App\Models\User;

class TeachingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numOfSubjects = Subject::count();
        $lecturerId = User::where('username', 'leemj')->first()->id;
        
        for ($i = 1; $i <= $numOfSubjects; $i++) {
            Teaching::create([
                'subject_id' => $i,
                'user_id' => $lecturerId
            ]);
        }
    }
}
