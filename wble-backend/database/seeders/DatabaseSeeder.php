<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Friend;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UserSeeder::class,
            SubjectSeeder::class,
            EnrollmentSeeder::class,
            SectionSeeder::class,
            FriendSeeder::class,
            MaterialSeeder::class,
            AnnouncementSeeder::class,
            TeachingSeeder::class,
            // Add other seeders here
        ]);
    }
}
