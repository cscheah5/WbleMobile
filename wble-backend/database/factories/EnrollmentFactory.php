<?php

namespace Database\Factories;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enrollment>
 */
class EnrollmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected static $usedCombinations = [];

    // total possible records = users * subjects
    // if we have 10 users and 10 subjects, we can have 100 records
    // if exceeded, it will loop forever
    public function definition(): array
    {
        do {
            $user = User::inRandomOrder()->first();
            $subject = Subject::inRandomOrder()->first();

            $key = $user->id . '-' . $subject->id;
        } while (isset(self::$usedCombinations[$key]));

        // Mark this pair as used
        self::$usedCombinations[$key] = true;

        return [
            'user_id' => $user->id,
            'subject_id' => $subject->id,
        ];
    }
}
